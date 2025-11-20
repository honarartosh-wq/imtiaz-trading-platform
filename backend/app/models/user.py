from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    MANAGER = "manager"
    ADMIN = "admin"
    CLIENT = "client"


class AccountType(str, enum.Enum):
    STANDARD = "standard"
    BUSINESS = "business"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), nullable=False)
    account_type = Column(SQLEnum(AccountType), nullable=True)  # Only for clients
    account_number = Column(String, unique=True, nullable=True)  # Only for clients
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Branch relationship (for admins and clients)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
    branch = relationship("Branch", back_populates="users")

    # Referral code used during registration
    referral_code = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", foreign_keys="Transaction.user_id", back_populates="user", cascade="all, delete-orphan")
    trades = relationship("Trade", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email} - {self.role}>"
