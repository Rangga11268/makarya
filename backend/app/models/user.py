import uuid
from enum import Enum
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, Enum):
    UMKM = "UMKM"
    MHS = "MHS"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String(50), unique=True, nullable=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SqlEnum(UserRole, name="user_role_enum"), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(), onupdate=func.now())

    # Relationship 

    profile_mhs = relationship("ProfileMhs", back_populates="user", uselist=False, cascade="all, delete-orphan")
    profile_umkm = relationship("ProfileUmkm", back_populates="user", uselist=False, cascade="all, delete-orphan")
    wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")