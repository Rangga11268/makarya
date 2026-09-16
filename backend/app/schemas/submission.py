from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from uuid import UUID
from typing import Optional, List
from app.models.submission import SubmissionStatus


# Schema request untuk kirim hasil kerja (Khusus mahasiswa)
class SubmissionCreateRequest(BaseModel):
    project_id: UUID
    url_berkas: str = Field(
        ...,
        description="Link hasil kerja yang diupload ke cloud storage (misal: Google Drive, Github, Figma, Cloudinary, dll)",
    )
    catatan_pengiriman: Optional[str] = Field(
        None, max_length=1000, description="Catatan tambahan untuk hasil kerja (opsional)"
    )


# Schema request minta revisi (KHUSUS UMKM)
class RevisionRequest(BaseModel):
    alasan_revisi: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Uraian alasan mengapa hasil kerja perlu direvisi (minimal 10 karakter, maksimal 1000 karakter)",
    )
    checklist_items: Optional[List[str]] = Field(
        None, description="Daftar poin perbaikan terstruktur (opsional)"
    )


# Schema respon kirim hasil kerja / minta revisi
class SubmissionResponse(BaseModel):
    id: UUID
    proposal_id: UUID
    url_berkas: str
    url_source_file: Optional[str] = None
    catatan_pengiriman: Optional[str] = None
    jumlah_revisi: int
    status: SubmissionStatus
    submitted_at: datetime
    updated_at: datetime

    # Submitter & Team Role Info
    submitter_name: Optional[str] = None
    submitter_photo: Optional[str] = None
    submitter_kampus: Optional[str] = None
    submitter_prodi: Optional[str] = None
    role_name: Optional[str] = None
    honor_amount: Optional[Decimal] = None
    slot_budget: Optional[Decimal] = None

    model_config = ConfigDict(from_attributes=True)