import uuid
from enum import Enum
from sqlalchemy import Column, String, Text, Boolean, DateTime, Enum as SqlEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class NotificationType(str, Enum):
    PROPOSAL = "PROPOSAL"
    PAYMENT = "PAYMENT"
    SUBMISSION = "SUBMISSION"
    DISPUTE = "DISPUTE"
    SYSTEM = "SYSTEM"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    judul = Column(String(100), nullable=False)
    pesan = Column(Text, nullable=False)
    tipe = Column(SqlEnum(NotificationType, name="notification_type_enum"), nullable=False)
    url_referensi = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationship
    user = relationship("User", backref="notifications")