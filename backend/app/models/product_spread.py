from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class ProductSpread(Base):
    __tablename__ = "product_spreads"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, nullable=False, index=True)  # e.g., "EURUSD", "XAUUSD"
    name = Column(String, nullable=False)  # Display name

    # Spread configuration - Using Numeric for precision
    base_spread = Column(Numeric(precision=10, scale=5), default=0.0)  # Base spread from liquidity provider
    extra_spread = Column(Numeric(precision=10, scale=5), default=0.0)  # Additional spread added by platform

    # Product metadata
    category = Column(String, default="forex")  # forex, commodity, crypto
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<ProductSpread {self.symbol} - Extra: {self.extra_spread}>"
