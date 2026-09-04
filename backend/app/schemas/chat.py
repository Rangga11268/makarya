from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, field_validator


class ChatMessageCreate(BaseModel):
    project_id: Optional[UUID] = None
    message: Optional[str] = Field(None, max_length=1000, description="Isi pesan chat")
    attachment_url: Optional[str] = Field(None, max_length=500, description="URL lampiran (opsional)")
    attachment_type: Optional[str] = Field(None, max_length=50, description="Tipe lampiran (opsional)")

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip()
            return clean if clean else None
        return None

    @field_validator("attachment_type")
    @classmethod
    def validate_attachment_type(cls, v: Optional[str]) -> Optional[str]:
        if v:
            clean_type = v.strip().upper()
            if not clean_type:
                return None
            allowed_types = ["LINK", "IMAGE", "FILE", "FIGMA"]
            if clean_type not in allowed_types:
                raise ValueError(f"Tipe lampiran tidak valid. Harus salah satu dari: {', '.join(allowed_types)}")
            return clean_type
        return None

    @field_validator("attachment_url")
    @classmethod
    def validate_attachment_url(cls, v: Optional[str]) -> Optional[str]:
        if v:
            clean_url = v.strip()
            if not clean_url:
                return None
            if not (clean_url.startswith("http://") or clean_url.startswith("https://")):
                raise ValueError("URL lampiran harus dimulai dengan 'http://' atau 'https://'")
            return clean_url
        return None


class ChatMessageResponse(BaseModel):
    id: UUID
    project_id: UUID
    sender_id: UUID
    sender_name: Optional[str] = None
    sender_role: Optional[str] = None
    message: str
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)