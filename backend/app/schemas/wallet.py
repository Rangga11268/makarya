from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, Field
from app.models.wallet import TransactionType

# Schema respon dompet
class WalletResponse(BaseModel):
    id: UUID
    user_id: UUID
    saldo_aktif: Decimal
    saldo_escrow: Decimal
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Schema request topup saldo(Khusus UMKM)
class TopUpRequest(BaseModel):
    nominal: Decimal = Field(..., ge=10000, le=10000000, description="Nominal topup saldo (Rp. 10.000 - Rp. 10.000.000)")

# Schema respon topup saldo (mengembalikan snap token untuk popup midtrans)
class TopUpResponse(BaseModel):
    order_id: str
    snap_token: str
    redirect_url: str
    nominal: Decimal

# Schema request penarikan saldo (Widraw ke bank)
class WithdrawRequest(BaseModel):
    nominal: Decimal = Field(..., ge=25000, description="Nominal penarikan saldo minimal Rp. 25.000")
    nama_bank: str = Field(..., min_length=2, max_length=50, description="Nama bank tujuan")
    nomor_rekening: str = Field(..., min_length=5, max_length=30, description="Nomor rekening tujuan")
    nama_pemilik: str = Field(..., min_length=2, max_length=100, description="Nama pemilik rekening tujuan")

# Schema respon riwayat mutasi / buku besar(Ledger log)
class LedgerLogResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    project_id: Optional[UUID] = None
    tipe: TransactionType
    nominal: Decimal
    keterangan: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


