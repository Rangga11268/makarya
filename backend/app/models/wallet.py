import uuid
from enum import Enum
from sqlalchemy import Column, String, Numeric, DateTime, Enum as SqlEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class TransactionType(str, Enum):
    TOPUP = "TOPUP"
    HOLD = "HOLD"
    RELEASE = "RELEASE"
    WITHDRAW = "WITHDRAW"
    REFUND = "REFUND"


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    saldo_aktif = Column(Numeric(precision=15, scale=2), default=0.00, nullable=False)
    saldo_escrow = Column(Numeric(precision=15, scale=2), default=0.00, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="wallet")
    logs = relationship("LedgerLog", back_populates="wallet", cascade="all, delete-orphan")



class LedgerLog(Base):
    __tablename__ = "ledger_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    wallet_id = Column(UUID(as_uuid=True), ForeignKey("wallets.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    tipe = Column(SqlEnum(TransactionType, name="transaction_type_enum"), nullable=False)
    nominal = Column(Numeric(precision=15, scale=2), nullable=False)
    referensi_gateway = Column(String(100), nullable=True)
    keterangan = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationship
    wallet = relationship("Wallet", back_populates="logs")