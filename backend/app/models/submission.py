import uuid
from enum import Enum
from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey, Enum as SqlEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class SubmissionStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    REVISION_REQUESTED = "REVISION_REQUESTED"
    ACCEPTED = "ACCEPTED"

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id", ondelete="CASCADE"), nullable=False, unique=True)
    url_berkas = Column(Text, nullable=False)
    url_source_file = Column(Text, nullable=True)
    catatan_pengiriman = Column(Text, nullable=True)
    jumlah_revisi = Column(Integer, default=0, nullable=False)
    status = Column(SqlEnum(SubmissionStatus, name="submission_status_enum"), default=SubmissionStatus.SUBMITTED, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)

    # Lindungin ddatabase dari mahasiswa eklpoitasi Revisi maks 2
    __table_args__ = (
        CheckConstraint('jumlah_revisi >= 0 AND jumlah_revisi <= 2', name='check_max_revision_limit'),
    )

    # Relationship
    proposal = relationship("Proposal", back_populates="submission")