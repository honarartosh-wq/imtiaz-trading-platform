from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class TradeType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderType(str, enum.Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP = "STOP"


class TradeStatus(str, enum.Enum):
    PENDING = "pending"
    OPEN = "open"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)

    # User reference
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Trade details
    symbol = Column(String, nullable=False, index=True)  # EURUSD, XAUUSD, etc.
    trade_type = Column(SQLEnum(TradeType), nullable=False)  # BUY or SELL
    order_type = Column(SQLEnum(OrderType), nullable=False)  # MARKET, LIMIT, STOP

    # Quantities - Using Numeric for precision
    lots = Column(Numeric(precision=10, scale=2), nullable=False)  # Trading volume

    # Prices - Using Numeric with higher precision for forex prices
    open_price = Column(Numeric(precision=20, scale=5), nullable=False)
    close_price = Column(Numeric(precision=20, scale=5), nullable=True)
    stop_loss = Column(Numeric(precision=20, scale=5), nullable=True)
    take_profit = Column(Numeric(precision=20, scale=5), nullable=True)

    # P&L - Using Numeric for financial precision
    profit_loss = Column(Numeric(precision=15, scale=2), default=0.0)
    commission = Column(Numeric(precision=15, scale=2), default=0.0)
    swap = Column(Numeric(precision=15, scale=2), default=0.0)

    # Status
    status = Column(SQLEnum(TradeStatus), default=TradeStatus.OPEN)

    # MetaTrader reference
    mt_ticket = Column(String, unique=True, nullable=True)  # MT order ticket
    mt_magic = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    opened_at = Column(DateTime(timezone=True), server_default=func.now())
    closed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Additional info
    comment = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="trades")

    def __repr__(self):
        return f"<Trade {self.symbol} {self.trade_type} - {self.lots} lots - {self.status}>"
