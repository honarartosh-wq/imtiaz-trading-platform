from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# Enums
class LPStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    DISCONNECTED = "disconnected"


class LPType(str, Enum):
    PRIME_BROKER = "prime_broker"
    ECN = "ecn"
    MARKET_MAKER = "market_maker"
    AGGREGATOR = "aggregator"


class RoutingType(str, Enum):
    A_BOOK = "a_book"
    B_BOOK = "b_book"
    HYBRID = "hybrid"


class RoutingPriority(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"
    FALLBACK = "fallback"


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


# Liquidity Provider Schemas
class LiquidityProviderBase(BaseModel):
    name: str
    code: str
    lp_type: LPType
    status: LPStatus = LPStatus.ACTIVE
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    websocket_url: Optional[str] = None
    max_lot_size: float = 100.0
    min_lot_size: float = 0.01
    base_commission: float = 0.0
    markup_percentage: float = 0.0
    priority: int = 100
    supported_symbols: Optional[str] = None
    daily_volume_limit: Optional[float] = None
    position_limit: Optional[float] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: bool = True


class LiquidityProviderCreate(LiquidityProviderBase):
    pass


class LiquidityProviderUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[LPStatus] = None
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    websocket_url: Optional[str] = None
    max_lot_size: Optional[float] = None
    min_lot_size: Optional[float] = None
    base_commission: Optional[float] = None
    markup_percentage: Optional[float] = None
    priority: Optional[int] = None
    supported_symbols: Optional[str] = None
    daily_volume_limit: Optional[float] = None
    position_limit: Optional[float] = None
    description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: Optional[bool] = None


class LiquidityProviderResponse(LiquidityProviderBase):
    id: int
    avg_latency_ms: float
    success_rate: float
    uptime_percentage: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_connected_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Routing Rule Schemas
class RoutingRuleBase(BaseModel):
    name: str
    symbol: Optional[str] = None
    client_type: Optional[str] = None
    account_type: Optional[str] = None
    min_lot_size: Optional[float] = None
    max_lot_size: Optional[float] = None
    routing_type: RoutingType = RoutingType.A_BOOK
    lp_id: Optional[int] = None
    backup_lp_id: Optional[int] = None
    a_book_percentage: float = 100.0
    priority: int = 100
    is_active: bool = True
    active_hours_start: Optional[str] = None
    active_hours_end: Optional[str] = None
    active_days: Optional[str] = None
    max_slippage_pips: Optional[float] = None
    max_daily_volume: Optional[float] = None
    stop_loss_required: bool = False
    description: Optional[str] = None


class RoutingRuleCreate(RoutingRuleBase):
    pass


class RoutingRuleUpdate(BaseModel):
    name: Optional[str] = None
    symbol: Optional[str] = None
    client_type: Optional[str] = None
    account_type: Optional[str] = None
    min_lot_size: Optional[float] = None
    max_lot_size: Optional[float] = None
    routing_type: Optional[RoutingType] = None
    lp_id: Optional[int] = None
    backup_lp_id: Optional[int] = None
    a_book_percentage: Optional[float] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None
    active_hours_start: Optional[str] = None
    active_hours_end: Optional[str] = None
    active_days: Optional[str] = None
    max_slippage_pips: Optional[float] = None
    max_daily_volume: Optional[float] = None
    stop_loss_required: Optional[bool] = None
    description: Optional[str] = None


class RoutingRuleResponse(RoutingRuleBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
