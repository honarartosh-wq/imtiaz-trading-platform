from sqlalchemy import Column, Integer, String, DateTime, Boolean, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    referral_code = Column(String, unique=True, index=True, nullable=False)

    # Branch settings
    leverage = Column(Integer, default=100)
    commission_per_lot = Column(Numeric(precision=10, scale=2), default=5.0)

    # Branch admin credentials
    admin_email = Column(String, unique=True, nullable=False)
    admin_name = Column(String, nullable=False)

    # Status
    status = Column(String, default="active")  # active, inactive, suspended
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="branch")

    def __repr__(self):
        return f"<Branch {self.name} - {self.code}>"
