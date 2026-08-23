import uuid
from enum import Enum
from sqlalchemy import Column, ForeignKey, Integer,String, Text, Numeric, Date, DateTime, Enum as SqlEnum,CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class ProjectCategory(str, Enum):
    DESIGN = "DESIGN"
    UIUX = "UIUX"
    PEMROGRAMAN = "PEMROGRAMAN"
    VIDEO = "VIDEO"
    COPYWRITING = "COPYWRITING"
    ADMIN_DATA = "ADMIN_DATA"

class ProjectStatus(str, Enum):
    OPEN = "OPEN"
    BIDDING = "BIDDING"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    DONE = "DONE"
    CANCELLED = "CANCELLED"

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    umkm_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    judul = Column(String(255), nullable=False)
    deskripsi_raw = Column(Text, nullable=False)
    kategori = Column(SqlEnum(ProjectCategory, name="project_category_enum"), nullable=False, index=True)
    budget_max = Column(Numeric(12, 2), nullable=False)
    deadline = Column(Date, nullable=False)
    status = Column(SqlEnum(ProjectStatus, name="project_status_enum"), default=ProjectStatus.OPEN, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=False)

    #  Cek apakah bugdet_max nya tidak boleh lebih dari > 2 juta dan kurang dari 0
    __table_args__ = (
        CheckConstraint('budget_max > 0 AND budget_max <= 2000000', name='check_budget_limit'),
    )

    # Relationship
    umkm = relationship("User", backref="projects")
    proposals = relationship("Proposal", back_populates="project", cascade="all, delete-orphan")
    ai_requirements = relationship("AIRequirement", back_populates="project", cascade="all, delete-orphan")


    