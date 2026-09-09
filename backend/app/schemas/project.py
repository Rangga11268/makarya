from datetime import date, datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.models.project import ProjectCategory, ProjectStatus

# Schemas for Project Baru(KHUSUS UMKM) and Project Baru(KHUSUS UMKM) Update
class ProjectCreateRequest(BaseModel):
    judul: str = Field(..., min_length=5, max_length=200, description="Judul project")
    deskripsi_raw: str = Field(..., min_length=15, description="Deskripsi kebutuhan project min 15 karakter")
    kategori: ProjectCategory
    budget_max: Decimal = Field(..., gt=0, le=2000000, description="Budget maksimal project Rp 2.000.000")
    deadline: date = Field(..., description="Tenggat waktu pengerjaan project")

    @field_validator('deadline')
    @classmethod
    def validate_deadline_feature(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("Tenggat waktu harus berupa tanggal di masa depan")
        return v

# Schema untuk update project (khusus UMKM)
class ProjectUpdateRequest(BaseModel):
    judul: Optional[str] = Field(None, min_length=5, max_length=200, description="Judul project")
    deskripsi_raw: Optional[str] = Field(None, min_length=15, description="Deskripsi kebutuhan project min 15 karakter")
    kategori: Optional[ProjectCategory]
    budget_max: Optional[Decimal] = Field(None, gt=0, le=2000000, description="Budget maksimal project Rp 2.000.000")
    deadline: Optional[date] = Field(None, description="Tenggat waktu pengerjaan project")

    @field_validator('deadline')
    @classmethod
    def validate_deadline_feature(cls, v: date) -> date:
        if v and v <= date.today():
            raise ValueError("Tenggat waktu harus berupa tanggal di masa depan")
        return v

class ProjectReopenRequest(BaseModel):
    new_deadline: Optional[date] = Field(None, description="Tenggat waktu baru untuk proyek")
    reason: Optional[str] = Field(None, description="Alasan pembatalan kontrak dengan mahasiswa")

    @field_validator('new_deadline')
    @classmethod
    def validate_new_deadline(cls, v: Optional[date]) -> Optional[date]:
        if v and v <= date.today():
            raise ValueError("Tenggat waktu baru harus berupa tanggal di masa depan")
        return v

class ProjectTerminateRequest(BaseModel):
    reason: Optional[str] = Field(None, description="Alasan pembatalan proyek")

# Schema ringkas pemilik umkm(nested response proyek)
class UmkmSummary(BaseModel):
    user_id: Optional[UUID] = None
    nama_usaha: str
    bidang_industri: Optional[str] = None
    kota: Optional[str] = None
    url_foto_usaha: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Schema response proyek lengkap
class ProjectResponse(BaseModel):
    id: UUID
    umkm_id: UUID
    judul: str
    deskripsi_raw: str
    kategori: ProjectCategory
    budget_max: Decimal
    deadline: date
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime
    umkm_profile: Optional[UmkmSummary] = None
    umkm_nama: Optional[str] = None
    accepted_mhs_nama: Optional[str] = None
    accepted_mhs_foto: Optional[str] = None
    total_pelamar: int = 0
    match_score: Optional[int] = None
    match_reasons: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)
