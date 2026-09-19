from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class RatingCreateRequest(BaseModel):
    project_id: UUID
    ke_user_id: UUID
    skor: int = Field(..., ge=1, le=5, description="Skor rating keseluruhan antara 1 hingga 5")
    skor_kualitas: Optional[int] = Field(None, ge=1, le=5, description="Skor kualitas hasil kerja (1-5)")
    skor_waktu: Optional[int] = Field(None, ge=1, le=5, description="Skor ketepatan waktu (1-5)")
    skor_komunikasi: Optional[int] = Field(None, ge=1, le=5, description="Skor komunikasi & koordinasi (1-5)")
    ulasan: Optional[str] = Field(None, max_length=1000, description="Ulasan opsional dari rating")


# Schema response rating
class RatingResponse(BaseModel):
    id: UUID
    project_id: UUID
    dari_user_id: UUID
    ke_user_id: UUID
    skor: int
    ulasan: Optional[str] = None
    created_at: datetime
    project_judul: Optional[str] = None
    dari_nama: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)