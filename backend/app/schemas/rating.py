from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

# Schema request beri rating
class RatingCreateRequest(BaseModel):
    project_id: UUID
    ke_user_id: UUID
    skor: int = Field(..., ge=1, le=5, description="Skor rating antara 1 hingga 5")
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

    model_config = ConfigDict(from_attributes=True)