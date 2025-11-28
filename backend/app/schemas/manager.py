from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Product Spread Schemas
class ProductSpreadBase(BaseModel):
    symbol: str
    name: str
    base_spread: float = 0.0
    extra_spread: float = 0.0
    category: str = "forex"
    is_active: bool = True


class ProductSpreadCreate(ProductSpreadBase):
    pass


class ProductSpreadUpdate(BaseModel):
    extra_spread: Optional[float] = None
    base_spread: Optional[float] = None
    is_active: Optional[bool] = None


class ProductSpreadResponse(ProductSpreadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Branch Commission Schemas
class BranchCommissionUpdate(BaseModel):
    commission_per_lot: float = Field(..., gt=0, description="Commission per lot must be positive")


class BranchResponse(BaseModel):
    id: int
    name: str
    code: str
    referral_code: str
    leverage: int
    commission_per_lot: float
    admin_email: str
    admin_name: str
    status: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
