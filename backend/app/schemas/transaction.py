from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.transaction import TransactionType, TransactionStatus


class TransactionBase(BaseModel):
    transaction_type: TransactionType
    amount: float = Field(..., gt=0)
    description: Optional[str] = None


class TransactionCreate(BaseModel):
    account_id: int
    transaction_type: TransactionType
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    to_user_id: Optional[int] = None  # For transfers


class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0)


class WithdrawRequest(BaseModel):
    amount: float = Field(..., gt=0)


class TransferRequest(BaseModel):
    to_email: str
    amount: float = Field(..., gt=0)
    description: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    account_id: int
    transaction_type: TransactionType
    amount: float
    balance_before: float
    balance_after: float
    description: Optional[str]
    reference: Optional[str]
    status: TransactionStatus
    created_at: datetime

    class Config:
        from_attributes = True
