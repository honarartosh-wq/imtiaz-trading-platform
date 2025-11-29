from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.models.user import User, UserRole
from app.models.branch import Branch
from app.models.account import Account
from app.middleware.auth import get_current_user
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    generate_account_number
)
from app.utils.logging import log_security_event, get_logger

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")  # Limit to 5 registration attempts per hour
async def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (client). Rate limited to 5 attempts per hour."""

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        log_security_event("registration", user_email=user_data.email, success=False, details="Email already registered")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate referral code and get branch
    branch = db.query(Branch).filter(Branch.referral_code == user_data.referral_code).first()
    if not branch:
        log_security_event("registration", user_email=user_data.email, success=False, details="Invalid referral code")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid referral code"
        )

    # Generate unique account number with collision detection
    max_attempts = 5
    account_number = None
    for attempt in range(max_attempts):
        account_number = generate_account_number()
        # Check if account number already exists
        existing_account = db.query(Account).filter(Account.account_number == account_number).first()
        if not existing_account:
            break
    else:
        # If we exhausted all attempts, raise an error
        log_security_event("registration", user_email=user_data.email, success=False,
                          details="Failed to generate unique account number")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate unique account number. Please try again."
        )

    try:
        # Create user
        new_user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            name=user_data.name,
            phone=user_data.phone,
            role=UserRole.CLIENT,
            account_type=user_data.account_type,
            account_number=account_number,
            branch_id=branch.id,
            referral_code=user_data.referral_code,
            is_active=True,
            is_verified=False
        )

        db.add(new_user)
        db.flush()  # Get the user ID without committing

        # Create account for the user
        account = Account(
            user_id=new_user.id,
            account_number=account_number,
            balance=0.0,
            wallet_balance=0.0,
            trading_balance=0.0,
            leverage=branch.leverage
        )

        db.add(account)
        db.commit()  # Commit both user and account together
        db.refresh(new_user)

        # Log successful registration
        log_security_event("registration", user_email=new_user.email, user_id=new_user.id, success=True,
                          details=f"Account created: {account_number}")
        logger.info(f"New user registered: {new_user.email} (ID: {new_user.id})")

        return new_user

    except Exception as e:
        db.rollback()
        logger.error(f"Registration failed for {user_data.email}: {str(e)}")
        log_security_event("registration", user_email=user_data.email, success=False,
                          details=f"Database error: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again later."
        )


@router.post("/login", response_model=Token)
@limiter.limit("10/minute")  # Limit to 10 login attempts per minute
async def login(request: Request, credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token. Rate limited to 10 attempts per minute."""

    try:
        # Find user
        user = db.query(User).filter(User.email == credentials.email).first()
        if not user:
            log_security_event("login", user_email=credentials.email, success=False, details="User not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            log_security_event("login", user_email=credentials.email, user_id=user.id, success=False, details="Invalid password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Check if user is active
        if not user.is_active:
            log_security_event("login", user_email=credentials.email, user_id=user.id, success=False, details="Account inactive")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )

        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()

        # Create tokens
        access_token = create_access_token(data={
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        })

        refresh_token = create_refresh_token(data={
            "user_id": user.id,
            "email": user.email
        })

        # Log successful login
        log_security_event("login", user_email=user.email, user_id=user.id, success=True, details=f"Role: {user.role}")
        logger.info(f"User logged in: {user.email} (ID: {user.id})")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    except HTTPException:
        # Re-raise HTTPExceptions (validation errors, auth errors, etc.)
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Login failed for {credentials.email}: {str(e)}")
        log_security_event("login", user_email=credentials.email, success=False,
                          details=f"System error: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again later."
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    return current_user
