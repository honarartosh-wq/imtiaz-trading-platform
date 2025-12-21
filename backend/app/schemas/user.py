from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import re
from app.models.user import UserRole, AccountType, KYCStatus


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    role: UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    referral_code: str = Field(..., min_length=1)
    account_type: AccountType = AccountType.STANDARD

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """
        Validate password strength.
        Requirements:
        - At least 6 characters (matching frontend requirement)
        """
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')

        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    phone: Optional[str]
    role: UserRole
    account_type: Optional[AccountType]
    account_number: Optional[str]
    branch_id: Optional[int]
    is_active: bool
    is_verified: bool
    kyc_status: Optional[KYCStatus]
    kyc_approved_at: Optional[datetime]
    kyc_rejection_reason: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None
