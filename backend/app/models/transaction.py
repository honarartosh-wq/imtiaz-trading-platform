from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class TransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAW = "withdraw"
    TRANSFER = "transfer"
    TRADE_PROFIT = "trade_profit"
    TRADE_LOSS = "trade_loss"
    COMMISSION = "commission"
    BONUS = "bonus"
    ADJUSTMENT = "adjustment"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    # References
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    # Transaction details
    transaction_type = Column(SQLEnum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    balance_before = Column(Float, nullable=False)
    balance_after = Column(Float, nullable=False)

    # Additional info
    description = Column(Text, nullable=True)
    reference = Column(String, unique=True, nullable=True)  # External reference
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.COMPLETED)

    # For transfers
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Performed by (for admin actions)
    performed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="transactions")
    account = relationship("Account", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.transaction_type} - {self.amount} - {self.status}>"
