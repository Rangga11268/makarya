import uuid
from sqlalchemy import Column, Numeric, ForeignKey, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class AIRequirement(Base):
    __tablename__ = "ai_requirements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("master_skills.id", ondelete="CASCADE"), nullable=False)
    ai_confidence_score = Column(Numeric(4, 3), nullable=False)
    processed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationship
    project = relationship("Project", back_populates="ai_requirements")
    skill = relationship("MasterSkill")