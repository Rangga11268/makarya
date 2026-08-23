import uuid
from enum import Enum
from sqlalchemy import Column, Text, ForeignKey, DateTime, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base



class DisputeStatus(str, Enum):
    OPEN = "OPEN"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    pelapor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    dekripsi_masalah = Column(Text, nullable=False)
    resolusi_masalah = Column(Text, nullable=True)
    status = Column(SqlEnum(DisputeStatus, name="dispute_status_enum"), default=DisputeStatus.OPEN, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationship
    project = relationship("Project", backref="disputes")
    pelapor = relationship("User", foreign_keys=[pelapor_id])
    admin = relationship("User", foreign_keys=[admin_id])