from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.models.user import User, UserRole, KYCStatus, AccountType
from app.models.branch import Branch
from app.models.account import Account
from app.models.kyc_document import KYCDocument, DocumentType, DocumentStatus
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

# KYC file upload directory
KYC_UPLOAD_DIR = Path("kyc_uploads")
KYC_UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf"
]

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def save_kyc_document(file: UploadFile, user_id: int, doc_type: DocumentType) -> str:
    """Save uploaded KYC document and return file path."""
    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: JPG, PNG, PDF"
        )

    # Read file content to check size
    content = await file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of 5MB"
        )

    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{user_id}_{doc_type.value}_{uuid.uuid4()}{file_extension}"
    file_path = KYC_UPLOAD_DIR / unique_filename

    # Save file
    with open(file_path, "wb") as f:
        f.write(content)

    return str(file_path)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: File size exceeds 5MB limit"
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name}: Invalid file type. Only JPG, PNG, and PDF are allowed"
        )

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

        new_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            name=name,
            phone=phone,
            role=UserRole.CLIENT,

        )

        db.add(new_user)
        db.flush()  # Get user ID

        # Save KYC documents
        try:
            # Save ID document
            id_doc_path = await save_kyc_document(id_document, new_user.id, DocumentType.ID_DOCUMENT)
            kyc_id_doc = KYCDocument(
                user_id=new_user.id,
                document_type=DocumentType.ID_DOCUMENT,
                file_path=id_doc_path,
                original_filename=id_document.filename,
                file_size=id_document.size or 0,
                mime_type=id_document.content_type,
                status=DocumentStatus.PENDING
            )
            db.add(kyc_id_doc)

            # Save proof of address
            poa_path = await save_kyc_document(proof_of_address, new_user.id, DocumentType.PROOF_OF_ADDRESS)
            kyc_poa = KYCDocument(
                user_id=new_user.id,
                document_type=DocumentType.PROOF_OF_ADDRESS,
                file_path=poa_path,
                original_filename=proof_of_address.filename,
                file_size=proof_of_address.size or 0,
                mime_type=proof_of_address.content_type,
                status=DocumentStatus.PENDING
            )
            db.add(kyc_poa)


        account = Account(
            user_id=new_user.id,
            account_number=account_number,
            balance=0.0,
            wallet_balance=0.0,
            trading_balance=0.0,
            leverage=branch.leverage
        )

        db.add(account)
        db.commit()
        db.refresh(new_user)

        # Log successful registration
        log_security_event("registration", user_email=new_user.email, user_id=new_user.id, success=True,


        return new_user

    except HTTPException:

        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Registration failed for {email}: {str(e)}")
        log_security_event("registration", user_email=email, success=False,

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

        # Check KYC status for clients
        if user.role == UserRole.CLIENT:
            if user.kyc_status == KYCStatus.PENDING:
                log_security_event("login", user_email=credentials.email, user_id=user.id, success=False, details="KYC pending")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Your KYC documents are pending approval. Please wait for verification."
                )
            elif user.kyc_status == KYCStatus.REJECTED:
                log_security_event("login", user_email=credentials.email, user_id=user.id, success=False, details="KYC rejected")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Your KYC was rejected. Reason: {user.kyc_rejection_reason or 'Please contact support.'}"
                )
            elif user.kyc_status != KYCStatus.APPROVED:
                log_security_event("login", user_email=credentials.email, user_id=user.id, success=False, details="KYC not approved")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Your account is not activated. Please complete KYC verification."
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
