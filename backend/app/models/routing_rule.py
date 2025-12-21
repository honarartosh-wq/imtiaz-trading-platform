from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class RoutingType(str, enum.Enum):
    """Routing Type"""
    A_BOOK = "a_book"  # Send to liquidity provider
    B_BOOK = "b_book"  # Internal matching
    HYBRID = "hybrid"   # Mix of both


class RoutingPriority(str, enum.Enum):
    """Routing Priority"""
    PRIMARY = "primary"
    SECONDARY = "secondary"
    FALLBACK = "fallback"


class RoutingRule(Base):
    """Routing Rule model for order routing configuration."""
    __tablename__ = "routing_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    # Rule conditions
    symbol = Column(String(20))  # Specific symbol or NULL for all
    client_type = Column(String(50))  # VIP, standard, etc., or NULL for all
    account_type = Column(String(50))  # demo, live, etc., or NULL for all
    min_lot_size = Column(Float)
    max_lot_size = Column(Float)

    # Routing configuration
    routing_type = Column(SQLEnum(RoutingType), nullable=False, default=RoutingType.A_BOOK)
    lp_id = Column(Integer, ForeignKey("liquidity_providers.id"), nullable=True)
    backup_lp_id = Column(Integer, ForeignKey("liquidity_providers.id"), nullable=True)

    # A-Book / B-Book split percentage (0-100)
    a_book_percentage = Column(Float, default=100.0)  # 100 = all A-Book, 0 = all B-Book

    # Priority and conditions
    priority = Column(Integer, default=100)  # Lower number = higher priority
    is_active = Column(Boolean, default=True)

    # Time-based routing
    active_hours_start = Column(String(5))  # e.g., "09:00"
    active_hours_end = Column(String(5))    # e.g., "17:00"
    active_days = Column(String(50))  # e.g., "mon,tue,wed,thu,fri"

    # Risk management
    max_slippage_pips = Column(Float)
    max_daily_volume = Column(Float)
    stop_loss_required = Column(Boolean, default=False)

    # Metadata
    description = Column(String(500))
    created_by = Column(Integer, ForeignKey("users.id"))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    liquidity_provider = relationship("LiquidityProvider", foreign_keys=[lp_id])
    backup_liquidity_provider = relationship("LiquidityProvider", foreign_keys=[backup_lp_id])

    def __repr__(self):
        return f"<RoutingRule(name={self.name}, type={self.routing_type}, priority={self.priority})>"
