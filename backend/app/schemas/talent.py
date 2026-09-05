from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TalentReview(BaseModel):
    id: UUID
    project_id: UUID
    client_name: str
    skor: int
    ulasan: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TalentResponse(BaseModel):
    id: UUID
    nama_lengkap: str
    email: str
    nim: Optional[str] = None
    prodi: Optional[str] = None
    url_foto: Optional[str] = None
    url_portofolio: Optional[str] = None
    bio: Optional[str] = None
    rating_avg: float = 0.0
    total_proyek_selesai: int = 0
    skills: List[str] = []
    reviews_count: int = 0
    recent_reviews: List[TalentReview] = []

    model_config = ConfigDict(from_attributes=True)
