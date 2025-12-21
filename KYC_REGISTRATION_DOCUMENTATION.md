# KYC Registration Documentation

## Overview
The Imtiaz Trading Platform now includes a comprehensive KYC (Know Your Customer) registration process for both Standard and Business client accounts. All new registrations require document verification and admin approval before accounts can be activated.

## Registration Flow

### 1. User Registration (Frontend)
**Location:** `src/components/Login.jsx`

#### Form Fields
- **Basic Information:**
  - Full Name (required)
  - Email Address (required)
  - Phone Number (optional)
  - Branch Referral Code (required)
  - Password & Confirm Password (required)

- **Account Type Selection:**
  - **Standard Account** - Individual trading account
  - **Business Account** - Corporate/business trading account

- **KYC Documents (Required):**
  - **ID/Passport Document** (required for all accounts)
  - **Proof of Address** (required for all accounts)
  - **Business Registration Document** (required for business accounts only)
  - **Tax Identification Document** (required for business accounts only)

#### Document Requirements
- **File Formats:** JPG, PNG, PDF
- **Max File Size:** 5MB per document
- **Quality:** Clear, readable copies

### 2. Frontend Validation
The registration form validates:
- All required fields are filled
- Password match (password === confirmPassword)
- Password length (minimum 6 characters)
- Branch referral code presence
- Required KYC documents uploaded
- File size limits (5MB per file)
- File type restrictions (JPG, PNG, PDF only)

### 3. API Call
**Endpoint:** `POST /api/auth/register`

**Content-Type:** `multipart/form-data`

**FormData Fields:**
```javascript
{
  // Basic Info
  name: string,
  email: string,
  phone: string (optional),
  password: string,
  referral_code: string,
  account_type: 'standard' | 'business',

  // KYC Documents (File uploads)
  id_document: File,
  proof_of_address: File,
  business_document: File (if business account),
  tax_document: File (if business account)
}
```

### 4. Backend Implementation Requirements

#### Database Schema

##### Users Table Updates
```sql
ALTER TABLE users ADD COLUMN kyc_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN kyc_approved_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN kyc_approved_by INTEGER NULL;
ALTER TABLE users ADD COLUMN kyc_rejection_reason TEXT NULL;
```

Possible `kyc_status` values:
- `pending` - Documents submitted, awaiting review
- `under_review` - Admin is reviewing documents
- `approved` - KYC verified, account active
- `rejected` - KYC failed, with reason provided
- `resubmit_required` - Need to upload new documents

##### KYC Documents Table
```sql
CREATE TABLE kyc_documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  document_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_at TIMESTAMP NULL,
  reviewed_by INTEGER NULL REFERENCES users(id),
  notes TEXT NULL
);
```

Document types:
- `id_document`
- `proof_of_address`
- `business_document`
- `tax_document`

#### Backend API Endpoint

**POST /api/auth/register**

```python
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional

@router.post("/api/auth/register")
async def register_with_kyc(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    referral_code: str = Form(...),
    account_type: str = Form(...),
    phone: Optional[str] = Form(None),
    id_document: UploadFile = File(...),
    proof_of_address: UploadFile = File(...),
    business_document: Optional[UploadFile] = File(None),
    tax_document: Optional[UploadFile] = File(None)
):
    # 1. Validate referral code
    branch = await validate_referral_code(referral_code)
    if not branch:
        raise HTTPException(400, "Invalid referral code")

    # 2. Check if email already exists
    existing_user = await get_user_by_email(email)
    if existing_user:
        raise HTTPException(400, "Email already registered")

    # 3. Validate business documents if business account
    if account_type == 'business':
        if not business_document or not tax_document:
            raise HTTPException(400, "Business documents required")

    # 4. Create user with kyc_status = 'pending'
    user = await create_user({
        "name": name,
        "email": email,
        "password": hash_password(password),
        "phone": phone,
        "account_type": account_type,
        "branch_id": branch.id,
        "kyc_status": "pending",
        "is_active": False  # Account inactive until KYC approved
    })

    # 5. Save documents to secure storage
    documents = [
        ("id_document", id_document),
        ("proof_of_address", proof_of_address)
    ]

    if account_type == 'business':
        documents.extend([
            ("business_document", business_document),
            ("tax_document", tax_document)
        ])

    for doc_type, file in documents:
        if file:
            # Save file to secure storage (S3, local filesystem, etc.)
            file_path = await save_kyc_document(user.id, doc_type, file)

            # Record in database
            await create_kyc_document({
                "user_id": user.id,
                "document_type": doc_type,
                "file_path": file_path,
                "original_filename": file.filename,
                "file_size": file.size,
                "mime_type": file.content_type,
                "status": "pending"
            })

    # 6. Send email notifications
    await send_email_to_user(
        email=user.email,
        subject="Registration Successful - KYC Under Review",
        body=f"Your account has been created. Your KYC documents are being reviewed. You will receive an email once approved."
    )

    await send_email_to_admins(
        subject="New KYC Submission",
        body=f"New user {name} ({email}) has submitted KYC documents for review."
    )

    return {
        "success": True,
        "message": "Registration successful. KYC documents pending approval.",
        "user_id": user.id,
        "kyc_status": "pending"
    }
```

### 5. KYC Approval Workflow

#### Admin Review Endpoints

**GET /api/admin/kyc/pending**
- Returns list of users with pending KYC

**GET /api/admin/kyc/user/{user_id}**
- Returns user details and KYC documents

**GET /api/admin/kyc/document/{document_id}**
- Downloads KYC document (secure, admin-only)

**POST /api/admin/kyc/approve/{user_id}**
```python
@router.post("/api/admin/kyc/approve/{user_id}")
async def approve_kyc(user_id: int, admin_user: User = Depends(get_current_admin)):
    # Update user
    await update_user(user_id, {
        "kyc_status": "approved",
        "kyc_approved_at": datetime.now(),
        "kyc_approved_by": admin_user.id,
        "is_active": True
    })

    # Update documents
    await update_all_user_documents(user_id, {
        "status": "approved",
        "reviewed_at": datetime.now(),
        "reviewed_by": admin_user.id
    })

    # Send approval email
    user = await get_user(user_id)
    await send_email(
        user.email,
        "KYC Approved - Account Activated",
        "Your KYC documents have been verified. You can now login and start trading."
    )

    return {"success": True, "message": "KYC approved"}
```

**POST /api/admin/kyc/reject/{user_id}**
```python
@router.post("/api/admin/kyc/reject/{user_id}")
async def reject_kyc(
    user_id: int,
    reason: str = Form(...),
    admin_user: User = Depends(get_current_admin)
):
    await update_user(user_id, {
        "kyc_status": "rejected",
        "kyc_rejection_reason": reason,
        "is_active": False
    })

    user = await get_user(user_id)
    await send_email(
        user.email,
        "KYC Rejected - Action Required",
        f"Your KYC documents were rejected. Reason: {reason}\nPlease contact support or resubmit."
    )

    return {"success": True, "message": "KYC rejected"}
```

### 6. User Login with KYC Status

**Modified Login Endpoint:**
```python
@router.post("/api/auth/login")
async def login(email: str, password: str):
    user = await authenticate_user(email, password)

    if not user:
        raise HTTPException(401, "Invalid credentials")

    # Check KYC status
    if user.kyc_status == "pending":
        raise HTTPException(403, "Your KYC documents are pending approval. Please wait for verification.")

    if user.kyc_status == "rejected":
        raise HTTPException(403, f"Your KYC was rejected. Reason: {user.kyc_rejection_reason}")

    if user.kyc_status != "approved":
        raise HTTPException(403, "Your account is not activated. Please complete KYC verification.")

    # Generate tokens
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_to_dict(user)
    }
```

### 7. Security Considerations

#### File Storage
- Store KYC documents in secure, encrypted storage
- Use secure file paths (no user-generated filenames)
- Implement access controls (admin-only access)
- Consider using cloud storage with encryption (AWS S3, Azure Blob)

#### File Validation
- Validate file types (magic number checking, not just extension)
- Scan for malware/viruses
- Limit file sizes
- Sanitize filenames

#### Data Privacy
- Implement audit logs for document access
- Encrypt sensitive documents at rest
- Implement data retention policies
- Comply with GDPR/data protection regulations

#### Access Control
- Only admins can view KYC documents
- Log all document access
- Implement role-based access control (RBAC)

### 8. Email Notifications

Send emails for:
1. **Registration Success** - "KYC documents submitted, pending review"
2. **KYC Approved** - "Your account is now active"
3. **KYC Rejected** - "Your KYC was rejected" with reason
4. **Admin Notifications** - Alert admins of new KYC submissions

### 9. Testing

#### Test Cases
1. **Standard Account Registration:**
   - Submit with all required documents
   - Verify pending status
   - Admin approves
   - User can login

2. **Business Account Registration:**
   - Submit with all business documents
   - Verify business-specific validations
   - Admin review and approval

3. **Document Validation:**
   - Test file size limits
   - Test file type restrictions
   - Test missing documents

4. **KYC Rejection:**
   - Admin rejects with reason
   - User receives email
   - User cannot login

## Summary

The KYC registration system ensures:
- ✅ All new clients submit identity documents
- ✅ Business accounts submit additional business documents
- ✅ Documents are securely stored and encrypted
- ✅ Admin approval required before account activation
- ✅ Users cannot login until KYC approved
- ✅ Clear communication via email at each stage
- ✅ Compliance with financial regulations

## Next Steps for Backend Implementation

1. Create database migrations for KYC tables
2. Implement file upload handling with security checks
3. Create secure document storage system
4. Build admin KYC review dashboard
5. Implement email notification system
6. Add KYC status checks to login endpoint
7. Create audit logging for compliance
8. Test complete registration → approval → login flow
