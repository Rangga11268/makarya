import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    credential_id = Column(String(60), unique=True, nullable=False, index=True)
    mhs_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Snapshot metadata sertifikat
    recipient_name = Column(String(255), nullable=False)
    recipient_kampus = Column(String(255), nullable=False)
    recipient_prodi = Column(String(255), nullable=False)
    role_name = Column(String(100), nullable=False)
    project_title = Column(String(255), nullable=False)
    client_name = Column(String(255), nullable=False)
    project_category = Column(String(50), nullable=True)

    # Showcase settings
    is_showcase = Column(Boolean, default=True, nullable=False)
    showcase_description = Column(Text, nullable=True)
    showcase_url = Column(Text, nullable=True)
    deliverable_url = Column(Text, nullable=True)

    # Timestamps
    issued_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    mhs = relationship("User", foreign_keys=[mhs_id], backref="certificates")
    project = relationship("Project", backref="certificates")
    proposal = relationship("Proposal", backref="certificate")
