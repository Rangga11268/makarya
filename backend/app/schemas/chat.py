from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, field_validator


class ChatMessageCreate(BaseModel):
    project_id: Optional[UUID] = None
    recipient_id: Optional[UUID] = None
    message: Optional[str] = Field(None, max_length=1000, description="Isi pesan chat")
    attachment_url: Optional[str] = Field(None, max_length=5000, description="URL atau payload JSON lampiran (opsional)")
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
            allowed_types = ["LINK", "IMAGE", "FILE", "FIGMA", "PROJECT_OFFER", "OFFER"]
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
            # Jika berupa payload JSON (misalnya tawaran proyek resmi PROJECT_OFFER), izinkan
            if clean_url.startswith("{") or clean_url.startswith("["):
                return clean_url
            if not (clean_url.startswith("http://") or clean_url.startswith("https://") or clean_url.startswith("/")):
                raise ValueError("URL lampiran harus dimulai dengan 'http://' atau 'https://'")
            return clean_url
        return None


class ChatMessageResponse(BaseModel):
    id: UUID
    project_id: UUID
    sender_id: UUID
    recipient_id: Optional[UUID] = None
    sender_name: Optional[str] = None
    sender_role: Optional[str] = None
    sender_photo: Optional[str] = None
    message: str
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationItemResponse(BaseModel):
    id: str
    partner_id: UUID
    partner_name: str
    partner_role: str
    partner_photo: Optional[str] = None
    partner_sub: Optional[str] = None
    project_id: Optional[UUID] = None
    project_title: Optional[str] = None
    project_status: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
    is_online: bool = False

    model_config = ConfigDict(from_attributes=True)