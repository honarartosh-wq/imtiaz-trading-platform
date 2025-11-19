from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.account import AccountStatus


class AccountBase(BaseModel):
    account_number: str
    leverage: int = 100
    currency: str = "USD"


class AccountCreate(BaseModel):
    user_id: int
    leverage: int = Field(default=100, ge=1, le=1000)
    initial_deposit: Optional[float] = Field(default=0.0, ge=0)


class AccountResponse(BaseModel):
    id: int
    user_id: int
    account_number: str
    balance: float
    wallet_balance: float
    trading_balance: float
    leverage: int
    currency: str
    status: AccountStatus
    mt_login: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    last_activity: Optional[datetime]

    class Config:
        from_attributes = True


class AccountUpdate(BaseModel):
    balance: Optional[float] = None
    leverage: Optional[int] = Field(None, ge=1, le=1000)
    status: Optional[AccountStatus] = None
