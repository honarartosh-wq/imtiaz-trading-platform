# Login and Authentication Documentation

## Overview

The Imtiaz Trading Platform uses a JWT-based authentication system with KYC (Know Your Customer) verification integrated into the registration and login flow.

## Authentication System Architecture

### Technology Stack
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
  - Access Token: 30 minutes expiration
  - Refresh Token: 7 days expiration
- **Password Hashing**: bcrypt
- **Rate Limiting**: slowapi (IP-based rate limiting)
- **File Upload**: python-multipart for KYC documents

### Environment Configuration

Configuration is managed through environment variables in `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/imtiaz_trading

# Security
SECRET_KEY=dev-secret-key-change-in-production-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin Credentials
ADMIN_EMAIL=admin@imtiaz.com
ADMIN_PASSWORD=admin123

# Application
APP_NAME=Imtiaz Trading Platform
APP_VERSION=1.0.0
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

## Registration Flow

### Endpoint: POST `/api/auth/register`

**Location**: `backend/app/api/auth.py:77-272`

#### Rate Limiting
- **Limit**: 5 registration attempts per hour per IP address
- **Purpose**: Prevent spam and abuse

#### Request Format
The registration endpoint accepts `multipart/form-data` to support file uploads.

**Required Fields**:
- `name` (string): Full name
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters
- `referral_code` (string): Valid branch referral code
- `account_type` (string): Either "STANDARD" or "BUSINESS"
- `id_document` (file): Government-issued ID (JPG, PNG, or PDF, max 5MB)
- `proof_of_address` (file): Utility bill or bank statement (JPG, PNG, or PDF, max 5MB)

**Additional Fields for Business Accounts**:
- `business_document` (file): Business registration certificate
- `tax_document` (file): Tax registration document

**Optional Fields**:
- `phone` (string): Contact phone number

#### Validation Rules

1. **Password Validation**
   - Minimum 6 characters
   - Validation happens at both schema level and endpoint level

2. **Email Validation**
   - Must be a valid email format
   - Must not already exist in the system

3. **Account Type Validation**
   - Must be either "STANDARD" or "BUSINESS"
   - Business accounts require additional documents

4. **Referral Code Validation**
   - Must match an existing branch's referral code
   - Associates user with the branch for commission tracking

5. **File Upload Validation**
   - **Allowed Types**: JPG, PNG, PDF
   - **Max Size**: 5MB per file
   - **MIME Type Check**: Enforced on upload
   - Files are stored in `kyc_uploads/` directory
   - Filename format: `{user_id}_{doc_type}_{uuid}{extension}`

#### Registration Process

1. **Validate Input**
   - Check password length
   - Verify email doesn't exist
   - Validate account type
   - Verify referral code exists
   - For business accounts, ensure business documents are provided

2. **Generate Account Number**
   - Format: 10-digit number starting with 1, 2, or 3
   - Up to 5 attempts to generate a unique number
   - Example: 1234567890

3. **Create User Record**
   - Password is hashed using bcrypt
   - User is created with `is_active=False` (inactive until KYC approved)
   - `kyc_status` is set to `PENDING`
   - User role is set to `CLIENT`

4. **Save KYC Documents**
   - Each uploaded file is saved to disk
   - Metadata is stored in `kyc_documents` table
   - Document status is set to `PENDING`
   - Stores: file_path, original_filename, file_size, mime_type

5. **Create Account**
   - Account is created with balance of 0.0
   - Leverage is inherited from the branch
   - Account is linked to the user

6. **Log Security Event**
   - Successful registration is logged with account number
   - Failed attempts are logged with reason

#### Response

**Success (201 Created)**:
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "CLIENT",
  "account_type": "STANDARD",
  "account_number": "1234567890",
  "branch_id": 1,
  "is_active": false,
  "is_verified": false,
  "kyc_status": "PENDING",
  "kyc_approved_at": null,
  "kyc_rejection_reason": null,
  "created_at": "2025-12-21T20:00:00Z",
  "last_login": null
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input, email exists, invalid referral code, missing business documents
- `500 Internal Server Error`: Database or file system errors

## Login Flow

### Endpoint: POST `/api/auth/login`

**Location**: `backend/app/api/auth.py:274-363`

#### Rate Limiting
- **Limit**: 10 login attempts per minute per IP address
- **Purpose**: Prevent brute force attacks

#### Request Format

**Content-Type**: `application/json`

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### Login Process

1. **Find User**
   - Query database for user by email
   - If not found, return generic error (security best practice)

2. **Verify Password**
   - Use bcrypt to verify password against stored hash
   - If invalid, return generic error and log the attempt

3. **Check KYC Status** (for CLIENT role only)

   a. **If KYC is PENDING**:
   ```
   HTTP 403 Forbidden
   "Your KYC documents are pending approval. Please wait for verification."
   ```

   b. **If KYC is REJECTED**:
   ```
   HTTP 403 Forbidden
   "Your KYC was rejected. Reason: {kyc_rejection_reason}"
   ```

   c. **If KYC is not APPROVED**:
   ```
   HTTP 403 Forbidden
   "Your account is not activated. Please complete KYC verification."
   ```

4. **Check User Active Status**
   - If `is_active=False`, login is denied
   - Returns 403 Forbidden

5. **Update Last Login**
   - Set `last_login` to current UTC timestamp
   - Commit to database

6. **Generate Tokens**

   **Access Token** (30 minutes):
   ```python
   {
     "user_id": user.id,
     "email": user.email,
     "role": user.role  # ADMIN, MANAGER, or CLIENT
   }
   ```

   **Refresh Token** (7 days):
   ```python
   {
     "user_id": user.id,
     "email": user.email
   }
   ```

7. **Log Security Event**
   - Successful login logged with role
   - Failed attempts logged with reason

#### Response

**Success (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: KYC pending, rejected, or account inactive
- `500 Internal Server Error`: System errors

## Current User Endpoint

### Endpoint: GET `/api/auth/me`

**Location**: `backend/app/api/auth.py:366-372`

**Purpose**: Get the authenticated user's information

**Headers Required**:
```
Authorization: Bearer {access_token}
```

**Response**:
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "CLIENT",
  "account_type": "STANDARD",
  "account_number": "1234567890",
  "branch_id": 1,
  "is_active": true,
  "is_verified": true,
  "kyc_status": "APPROVED",
  "kyc_approved_at": "2025-12-21T21:00:00Z",
  "kyc_rejection_reason": null,
  "created_at": "2025-12-21T20:00:00Z",
  "last_login": "2025-12-21T22:00:00Z"
}
```

## Database Models

### User Model

**File**: `backend/app/models/user.py`

**Key Fields**:
```python
class User(Base):
    id: int
    email: str (unique, indexed)
    hashed_password: str
    name: str
    phone: Optional[str]
    role: UserRole (ADMIN, MANAGER, CLIENT)
    account_type: Optional[AccountType] (STANDARD, BUSINESS)
    account_number: Optional[str] (unique)
    branch_id: Optional[int]
    referral_code: Optional[str]
    is_active: bool (default: False)
    is_verified: bool (default: False)

    # KYC Fields
    kyc_status: KYCStatus (PENDING, UNDER_REVIEW, APPROVED, REJECTED, RESUBMIT_REQUIRED)
    kyc_approved_at: Optional[datetime]
    kyc_approved_by: Optional[int]  # Foreign key to admin/manager user
    kyc_rejection_reason: Optional[str]

    # Timestamps
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]

    # Relationships
    kyc_documents: List[KYCDocument]
    account: Account
    branch: Branch
```

### KYCDocument Model

**File**: `backend/app/models/kyc_document.py`

```python
class KYCDocument(Base):
    id: int
    user_id: int
    document_type: DocumentType (ID_DOCUMENT, PROOF_OF_ADDRESS, BUSINESS_DOCUMENT, TAX_DOCUMENT)
    file_path: str
    original_filename: str
    file_size: int  # bytes
    mime_type: str
    status: DocumentStatus (PENDING, APPROVED, REJECTED)

    # Review information
    reviewed_at: Optional[datetime]
    reviewed_by: Optional[int]  # Foreign key to admin user
    notes: Optional[str]

    # Timestamp
    uploaded_at: datetime

    # Relationship
    user: User
```

## Security Features

### 1. Password Security
- **Hashing**: bcrypt with automatic salt generation
- **Minimum Length**: 6 characters
- **Storage**: Only hashed passwords stored in database

### 2. JWT Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: Stored in environment variable
- **Token Expiration**:
  - Access: 30 minutes (short-lived for security)
  - Refresh: 7 days (for convenient re-authentication)
- **Token Payload**: Includes user_id, email, and role

### 3. Rate Limiting
- **Registration**: 5 attempts per hour per IP
- **Login**: 10 attempts per minute per IP
- **Implementation**: slowapi with in-memory storage

### 4. Security Event Logging
- All authentication events are logged
- Includes: timestamp, user email, user ID, success/failure, details
- **File**: `backend/app/utils/logging.py`

### 5. CORS Protection
- Configured allowed origins in environment
- Default: localhost:5173, localhost:3000

### 6. File Upload Security
- MIME type validation
- File size limits (5MB)
- Unique filename generation with UUID
- Separate storage directory

## KYC Workflow

### User Registration → KYC Submission
1. User registers with KYC documents
2. User account created with:
   - `is_active = False`
   - `kyc_status = PENDING`
3. Login is **blocked** until KYC approval

### Admin KYC Review (To Be Implemented)
1. Admin views pending KYC documents
2. Admin reviews uploaded files
3. Admin either:
   - **Approves**: Sets `kyc_status = APPROVED`, `is_active = True`
   - **Rejects**: Sets `kyc_status = REJECTED`, provides reason
4. User can now login if approved

### Client Login Flow
1. User attempts login
2. System checks:
   - Email and password match
   - KYC status is APPROVED
   - Account is active
3. If all checks pass, tokens are issued
4. If KYC is pending/rejected, login denied with informative message

## Frontend Integration

### Registration Example

```javascript
const registerUser = async (formData) => {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('phone', formData.phone);
  data.append('referral_code', formData.referralCode);
  data.append('account_type', formData.accountType);
  data.append('id_document', formData.idDocument);
  data.append('proof_of_address', formData.proofOfAddress);

  if (formData.accountType === 'BUSINESS') {
    data.append('business_document', formData.businessDocument);
    data.append('tax_document', formData.taxDocument);
  }

  const response = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    body: data
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return await response.json();
};
```

### Login Example

```javascript
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  const { access_token, refresh_token } = await response.json();

  // Store tokens
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  return { access_token, refresh_token };
};
```

### Authenticated Request Example

```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');

  const response = await fetch('http://localhost:8000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return await response.json();
};
```

## Server Management

### Starting the Backend Server

```bash
# Navigate to backend directory
cd /home/user/imtiaz-trading-platform/backend

# Set Python path
export PYTHONPATH=/home/user/imtiaz-trading-platform/backend

# Start server
python -m app.main
```

The server will:
- Create all database tables if they don't exist
- Create an admin user with credentials from .env
- Start on http://0.0.0.0:8000
- Enable hot reload in debug mode

### API Documentation

Once the server is running, you can access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Next Steps

### Pending Implementation

1. **Admin KYC Approval Endpoints**
   - GET `/api/admin/kyc/pending` - List pending KYC submissions
   - GET `/api/admin/kyc/{user_id}` - View user's KYC documents
   - POST `/api/admin/kyc/{user_id}/approve` - Approve KYC
   - POST `/api/admin/kyc/{user_id}/reject` - Reject KYC with reason
   - GET `/api/admin/kyc/documents/{doc_id}` - Download document file

2. **Token Refresh Endpoint**
   - POST `/api/auth/refresh` - Get new access token using refresh token

3. **Password Reset Flow**
   - POST `/api/auth/forgot-password` - Request password reset
   - POST `/api/auth/reset-password` - Reset password with token

4. **Email Verification**
   - Send verification email on registration
   - Endpoint to verify email address

## Troubleshooting

### Common Issues

1. **"ModuleNotFoundError" errors**
   - Solution: Install missing dependencies with `pip install <package>`
   - Required packages: fastapi, sqlalchemy, psycopg2-binary, python-jose, bcrypt, python-multipart, email-validator, slowapi

2. **"Connection refused" to PostgreSQL**
   - Solution: Start PostgreSQL service
   ```bash
   service postgresql start
   ```

3. **"Password authentication failed"**
   - Solution: Set postgres user password
   ```bash
   sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
   ```

4. **"Database does not exist"**
   - Solution: Create database
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE imtiaz_trading;"
   ```

5. **"File upload failed"**
   - Check file size is under 5MB
   - Verify file type is JPG, PNG, or PDF
   - Ensure kyc_uploads directory exists and is writable

## Security Considerations

### Production Deployment Checklist

- [ ] Change SECRET_KEY to a strong, random value
- [ ] Use a secure, random ADMIN_PASSWORD
- [ ] Enable HTTPS/TLS
- [ ] Use environment-specific .env files
- [ ] Configure proper CORS origins
- [ ] Set DEBUG=False
- [ ] Use a production-grade database
- [ ] Implement database backups
- [ ] Add request logging and monitoring
- [ ] Implement rate limiting at nginx/load balancer level
- [ ] Add file upload virus scanning
- [ ] Implement secure file storage (e.g., S3 with encryption)
- [ ] Add email verification for registration
- [ ] Implement 2FA for sensitive operations
- [ ] Set up SSL certificate for database connections
- [ ] Use secrets management service (e.g., AWS Secrets Manager)
- [ ] Enable SQL query logging for auditing
- [ ] Implement IP whitelisting for admin endpoints
- [ ] Add web application firewall (WAF)
- [ ] Regular security audits and penetration testing
