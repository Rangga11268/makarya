import uuid
from enum import Enum
from sqlalchemy import Column, ForeignKey, Integer, Numeric, Text, DateTime, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ProposalStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    mhs_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    harga_tawar = Column(Numeric(12, 2), nullable=False)
    cover_letter = Column(Text, nullable=False)
    estimasi_hari = Column(Integer, nullable=False)
    status = Column(SqlEnum(ProposalStatus, name="proposal_status_enum"), default=ProposalStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)

    # Relationship
    project = relationship("Project", back_populates="proposals")
    mahasiswa = relationship("User", backref="my_proposals")
    submission = relationship("Submission", back_populates="proposal", uselist=False, cascade="all, delete-orphan")