from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator
from app.models.dispute import DisputeStatus

# Schema request buka tiket sengketa (MHS atau UMKM)
class DisputeCreateRequest(BaseModel):
    project_id: UUID
    alasan: str = Field(..., min_length=20, max_length=1000, description="Alasan sengketa (minimal 20 karakter)")

# Schema request resolusi oleh admin(Eksekusi pembagian dana escrow)
class DisputeResolveRequest(BaseModel):
    keputusan_admin: str = Field(..., min_length=20, max_length=1000, description="Keputusan admin terkait sengketa (misal: 'MHS menang', 'UMKM menang', 'Bagi rata')")
    presentase_klien: Decimal = Field(..., ge=0, le=100, description="Presentase dana untuk klien (UMKM) dalam persen (0-100)")
    presentase_freelancer: Decimal = Field(..., ge=0, le=100, description="Presentase dana untuk freelancer (MHS) dalam persen (0-100)")

    @field_validator("presentase_freelancer")
    @classmethod
    def validate_total_split(cls, v:Decimal, values)-> Decimal:
         """Validasi Matematika Finansial: Total persentase harus tepat 100%"""
         persen_klien = values.data.get("presentase_klien", Decimal("0"))
         if (persen_klien + v) != Decimal("100"):
             raise ValueError(f"Total persentase pembagian dana harus tepat 100% (Saat ini: Klien + Freelancer = {persen_klien + v}%)")
         return v

# Schema response sengketa
class DisputeResponse(BaseModel):
    id: UUID
    project_id: UUID
    pelapor_id: UUID
    admin_id: Optional[UUID] = None
    dekripsi_masalah: str
    status: DisputeStatus
    resolusi_masalah: Optional[str] = None
    presentase_klien: Optional[Decimal] = None
    presentase_freelancer: Optional[Decimal] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True