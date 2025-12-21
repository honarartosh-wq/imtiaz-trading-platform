from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
import filetype
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
from app.utils.logging import log_security_event, log_kyc_upload, get_logger
from app.utils.file_storage import save_kyc_document

logger = get_logger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/auth", tags=["Authentication"])


# File validation constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def validate_kyc_file(file: UploadFile, field_name: str) -> bytes:
    """
    Validate uploaded KYC document.
    
    Args:
        file: Uploaded file
        field_name: Name of the field for error messages
    
    Returns:
        File contents as bytes
    
    Raises:
        HTTPException: If validation fails
    
    Security checks:
    - File size limit (5MB)
    - MIME type verification using magic numbers
    - Filename sanitization (prevent path traversal)
    - No double extensions allowed
    """
    # 1. Check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: File size exceeds 5MB limit"
        )
    
    # 2. Verify MIME type using magic numbers (filetype library)
    kind = filetype.guess(contents)
    allowed_types = ['jpg', 'jpeg', 'png', 'pdf']
    
    if kind is None or kind.extension not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: Invalid file type. Only JPG, PNG, and PDF are allowed"
        )
    
    # 3. Validate filename (prevent path traversal)
    filename = file.filename or ""
    if '..' in filename or '/' in filename or '\\' in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: Invalid filename"
        )
    
    # 4. Check for double extensions (e.g., file.pdf.exe)
    if filename.count('.') > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: Invalid filename with multiple extensions"
        )
    
    # Reset file pointer for potential re-reading
    await file.seek(0)
    
    return contents


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")  # Limit to 5 registration attempts per hour
async def register(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    referral_code: str = Form(...),
    account_type: str = Form(...),
    phone: Optional[str] = Form(None),
    id_document: UploadFile = File(...),
    proof_of_address: UploadFile = File(...),
    business_document: Optional[UploadFile] = File(None),
    tax_document: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Register a new user (client) with KYC document uploads.
    Rate limited to 5 attempts per hour.
    
    Required documents:
    - id_document: Government-issued ID or passport
    - proof_of_address: Utility bill, bank statement, etc.
    
    Additional for business accounts:
    - business_document: Business registration certificate
    - tax_document: Tax identification document
    """
    
    try:
        # Validate all uploaded files
        id_doc_contents = await validate_kyc_file(id_document, "ID Document")
        address_doc_contents = await validate_kyc_file(proof_of_address, "Proof of Address")
        
        # Business account specific validation
        business_doc_contents = None
        tax_doc_contents = None
        if account_type == "business":
            if not business_document or not tax_document:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Business accounts require business registration and tax documents"
                )
            business_doc_contents = await validate_kyc_file(business_document, "Business Document")
            tax_doc_contents = await validate_kyc_file(tax_document, "Tax Document")
        
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            log_security_event("registration", user_email=email, success=False, details="Email already registered")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Validate referral code and get branch
        branch = db.query(Branch).filter(Branch.referral_code == referral_code).first()
        if not branch:
            log_security_event("registration", user_email=email, success=False, details="Invalid referral code")
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
            log_security_event("registration", user_email=email, success=False,
                              details="Failed to generate unique account number")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to generate unique account number. Please try again."
            )

        # Create user
        new_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            name=name,
            phone=phone,
            role=UserRole.CLIENT,
            account_type=account_type,
            account_number=account_number,
            branch_id=branch.id,
            referral_code=referral_code,
            is_active=True,
            is_verified=False
        )

        db.add(new_user)
        db.flush()  # Get the user ID without committing

        # Save KYC documents with secure filenames
        id_doc_ext = filetype.guess(id_doc_contents).extension
        address_doc_ext = filetype.guess(address_doc_contents).extension
        
        id_doc_path = save_kyc_document(id_doc_contents, new_user.id, "id_document", id_doc_ext)
        address_doc_path = save_kyc_document(address_doc_contents, new_user.id, "proof_of_address", address_doc_ext)
        
        # Log KYC uploads
        log_kyc_upload(email, new_user.id, "ID_DOCUMENT", True, len(id_doc_contents), f"Saved to {id_doc_path}")
        log_kyc_upload(email, new_user.id, "PROOF_OF_ADDRESS", True, len(address_doc_contents), f"Saved to {address_doc_path}")
        
        # Handle business documents
        if account_type == "business" and business_doc_contents and tax_doc_contents:
            business_doc_ext = filetype.guess(business_doc_contents).extension
            tax_doc_ext = filetype.guess(tax_doc_contents).extension
            
            business_doc_path = save_kyc_document(business_doc_contents, new_user.id, "business_document", business_doc_ext)
            tax_doc_path = save_kyc_document(tax_doc_contents, new_user.id, "tax_document", tax_doc_ext)
            
            log_kyc_upload(email, new_user.id, "BUSINESS_DOCUMENT", True, len(business_doc_contents), f"Saved to {business_doc_path}")
            log_kyc_upload(email, new_user.id, "TAX_DOCUMENT", True, len(tax_doc_contents), f"Saved to {tax_doc_path}")

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
                          details=f"Account created: {account_number} with KYC documents")
        logger.info(f"New user registered: {new_user.email} (ID: {new_user.id}) with KYC documents")

        return new_user

    except HTTPException:
        # Re-raise HTTP exceptions (validation errors, etc.)
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Registration failed for {email}: {str(e)}")
        log_security_event("registration", user_email=email, success=False,
                          details=f"Error: {type(e).__name__}")
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
