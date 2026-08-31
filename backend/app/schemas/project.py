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

# Schema ringkas pemilik umkm(nested response proyek)
class UmkmSummary(BaseModel):
    user_id: Optional[UUID] = None
    nama_usaha: str
    bidang_industri: Optional[str] = None
    kota: Optional[str] = None

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
    total_pelamar: int = 0

    model_config = ConfigDict(from_attributes=True)
