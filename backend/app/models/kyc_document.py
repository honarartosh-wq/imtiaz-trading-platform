from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class DocumentType(str, enum.Enum):
    ID_DOCUMENT = "id_document"
    PROOF_OF_ADDRESS = "proof_of_address"
    BUSINESS_DOCUMENT = "business_document"
    TAX_DOCUMENT = "tax_document"


class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class KYCDocument(Base):
    __tablename__ = "kyc_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    file_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    mime_type = Column(String, nullable=False)
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.PENDING)

    # Review information
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(String, nullable=True)

    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="kyc_documents")

    def __repr__(self):
        return f"<KYCDocument {self.document_type} for User {self.user_id}>"
