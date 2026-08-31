from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from app.models.proposal import ProposalStatus

# Schema request kirim proposal (Khusus mhs)
class ProposalCreateRequest(BaseModel):
    project_id : UUID
    harga_tawar : Decimal = Field(..., gt=0, le=2000000, description="Penawaran harga maks Rp 2.000.000")
    cover_letter : str = Field(..., min_length=20, description="Alasan dan portfolio relevan minimal 20 karakter")
    estimasi_hari : int = Field(..., ge=1, le=90, description="Estimasi pengerjaan dalam 1 hingga 90 hari")


# Schema ringkas profile mahasiswa (Nested di response proposal untuk UMKM)
class MhsSummary(BaseModel):
    user_id : Optional[UUID] = None
    nama_lengkap : str
    nim : Optional[str] = None
    rating_avg : Decimal
    total_proyek_selesai : int
    url_foto : Optional[str] = None
    url_portofolio  : Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Schema response proposal lengkap

class ProposalResponse(BaseModel):
    id : UUID
    project_id : UUID
    mhs_id : UUID
    harga_tawar : Decimal
    cover_letter : str
    estimasi_hari : int
    status : ProposalStatus
    created_at : datetime
    updated_at : datetime
    mhs_profile : Optional[MhsSummary] = None
    project_judul : Optional[str] = None
    project_kategori : Optional[str] = None
    project_status : Optional[str] = None
    project_budget_max : Optional[Decimal] = None
    project_umkm_nama : Optional[str] = None

    model_config = ConfigDict(from_attributes=True)