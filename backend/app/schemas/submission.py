from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl
from uuid import UUID
from typing import Optional
from app.models.submission import SubmissionStatus

# Schema request untuk kirim hasil kerja(Khusus mahasiswa)
class SubmissionCreateRequest(BaseModel):
    project_id: UUID
    url_berkas: str = Field(..., description="Link hasil kerja yang diupload ke cloud storage (misal: Google Drive, Github, Figma, Cloudinary, dll)")
    catatan_pengiriman: Optional[str] = Field(None, max_length=1000, description="Catatan tambahan untuk hasil kerja (opsional)")

# Schema request minta revisi (KHUSUS UMKM)
class RevisionRequest(BaseModel):
    alasan_revisi: str = Field(..., min_length=10, max_length=1000, description="Uraian alasan mengapa hasil kerja perlu direvisi (minimal 10 karakter, maksimal 1000 karakter)")


# Schema respon kirim hasil kerja / minta revisi
class SubmissionResponse(BaseModel):
    id: UUID
    mhs_id: UUID
    project_id: UUID
    url_berkas: str
    catatan_pengiriman: Optional[str] = None
    jumlah_revisi: int
    status: SubmissionStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True