from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional

class NotificationResponse(BaseModel):
    id: UUID
    judul: str
    pesan: str
    tipe: str
    url_referensi: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
