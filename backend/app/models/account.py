from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    CLOSED = "closed"


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_number = Column(String, unique=True, index=True, nullable=False)

    # Balance information - Using Numeric for financial precision
    balance = Column(Numeric(precision=15, scale=2), default=0.0)
    wallet_balance = Column(Numeric(precision=15, scale=2), default=0.0)
    trading_balance = Column(Numeric(precision=15, scale=2), default=0.0)

    # Account settings
    leverage = Column(Integer, default=100)
    currency = Column(String, default="USD")
    status = Column(SQLEnum(AccountStatus), default=AccountStatus.ACTIVE)

    # MetaTrader integration
    mt_login = Column(String, unique=True, nullable=True)
    mt_server = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_activity = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Account {self.account_number} - Balance: {self.balance}>"
