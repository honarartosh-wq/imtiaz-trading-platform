from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, AccountType


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    role: UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    referral_code: str = Field(..., min_length=1)
    account_type: AccountType = AccountType.STANDARD


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
