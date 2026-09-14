import uuid
from enum import Enum
from sqlalchemy import Column, Numeric, DateTime, Enum as SqlEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class EscrowStatus(str, Enum):
    HELD = "HELD"                          # Dana dikunci saat UMKM menerima proposal / bayar
    IN_PROGRESS = "IN_PROGRESS"            # Mahasiswa aktif mengerjakan
    SUBMITTED = "SUBMITTED"                # Hasil kerja diserahkan, menunggu approval / timer auto-approve jalan
    REVISION = "REVISION"                  # UMKM meminta revisi (maks 2x)
    RELEASED = "RELEASED"                  # 100% honor dicairkan ke saldo aktif mahasiswa
    PARTIALLY_RELEASED = "PARTIALLY_RELEASED"  # Putusan sengketa split: dibagi antara UMKM & mahasiswa
    REFUNDED = "REFUNDED"                  # 100% dana dikembalikan ke saldo aktif UMKM
    DISPUTED = "DISPUTED"                  # Masuk mediasi sengketa oleh admin


class Escrow(Base):
    __tablename__ = "escrows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id", ondelete="SET NULL"), nullable=True, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    talent_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Nilai Transaksi & Fee Platform
    amount_total = Column(Numeric(precision=15, scale=2), nullable=False)
    platform_fee = Column(Numeric(precision=15, scale=2), default=0.00, nullable=False)
    amount_talent = Column(Numeric(precision=15, scale=2), nullable=False)

    # Status Siklus Hidup
    status = Column(SqlEnum(EscrowStatus, name="escrow_status_enum"), default=EscrowStatus.HELD, nullable=False, index=True)

    # Timer Otomasi Auto-Approval (Contoh: submitted_at + 7 hari)
    auto_approve_at = Column(DateTime(timezone=True), nullable=True, index=True)

    # Audit Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    released_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)

    # Relasi ORM
    project = relationship("Project", backref="escrows")
    proposal = relationship("Proposal", backref="escrows")
    client = relationship("User", foreign_keys=[client_id], backref="client_escrows")
    talent = relationship("User", foreign_keys=[talent_id], backref="talent_escrows")

