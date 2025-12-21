from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class LPStatus(str, enum.Enum):
    """Liquidity Provider Status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    DISCONNECTED = "disconnected"


class LPType(str, enum.Enum):
    """Liquidity Provider Type"""
    PRIME_BROKER = "prime_broker"
    ECN = "ecn"
    MARKET_MAKER = "market_maker"
    AGGREGATOR = "aggregator"


class LiquidityProvider(Base):
    """Liquidity Provider model for managing LP connections."""
    __tablename__ = "liquidity_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), nullable=False, unique=True)
    lp_type = Column(SQLEnum(LPType), nullable=False)
    status = Column(SQLEnum(LPStatus), default=LPStatus.ACTIVE, nullable=False)

    # Connection details
    api_endpoint = Column(String(255))
    api_key = Column(String(255))  # Should be encrypted in production
    websocket_url = Column(String(255))

    # Trading configuration
    max_lot_size = Column(Float, default=100.0)
    min_lot_size = Column(Float, default=0.01)
    base_commission = Column(Float, default=0.0)
    markup_percentage = Column(Float, default=0.0)

    # Performance metrics
    priority = Column(Integer, default=100)  # Lower number = higher priority
    avg_latency_ms = Column(Float, default=0.0)
    success_rate = Column(Float, default=100.0)
    uptime_percentage = Column(Float, default=100.0)

    # Supported products (comma-separated symbols)
    supported_symbols = Column(String(1000))  # e.g., "EURUSD,GBPUSD,XAUUSD"

    # Risk limits
    daily_volume_limit = Column(Float)
    position_limit = Column(Float)

    # Metadata
    description = Column(String(500))
    contact_email = Column(String(100))
    contact_phone = Column(String(50))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_connected_at = Column(DateTime(timezone=True))

    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<LiquidityProvider(name={self.name}, type={self.lp_type}, status={self.status})>"
