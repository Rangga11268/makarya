import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base



class Rating(Base):
    __tablename__ = "ratings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    dari_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ke_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skor = Column(Integer, nullable=False)
    ulasan = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # constraints skor 1-5 da hanya 1 x per user per project
    __table_args__ = (
        CheckConstraint("skor >= 1 AND skor <= 5", name="check_rating_skor_range"),
        UniqueConstraint("project_id", "dari_user_id", name="unique_rating_per_user_per_project"),
    )

    # Relationship
    project = relationship("Project", backref="ratings")
    dari_user = relationship("User", foreign_keys=[dari_user_id])
    ke_user = relationship("User", foreign_keys=[ke_user_id])