from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, field_validator


class ChatMessageCreate(BaseModel):
    project_id: Optional[UUID] = None
    recipient_id: Optional[UUID] = None
    message: Optional[str] = Field(None, max_length=1000, description="Isi pesan chat")
    attachment_url: Optional[str] = Field(None, max_length=5000, description="URL atau payload JSON lampiran (opsional)")
    attachment_type: Optional[str] = Field(None, max_length=50, description="Tipe lampiran (opsional)")
    reply_to_id: Optional[UUID] = None
    reply_to_meta: Optional[str] = None

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
            if not (clean_url.startswith("http://") or clean_url.startswith("https://") or clean_url.startswith("/") or clean_url.startswith("data:")):
                raise ValueError("URL lampiran harus dimulai dengan 'http://' atau 'https://' atau data base64")
            return clean_url
        return None


class ChatMessageEditRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="Isi pesan yang diperbarui")


class ChatMessageResponse(BaseModel):
    id: UUID
    project_id: UUID
    sender_id: UUID
    recipient_id: Optional[UUID] = None
    sender_name: Optional[str] = None
    sender_role: Optional[str] = None
    sender_photo: Optional[str] = None
    sender_role_label: Optional[str] = None
    message: str
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    is_read: bool
    is_edited: bool = False
    is_deleted: bool = False
    is_pinned: bool = False
    reply_to_id: Optional[UUID] = None
    reply_to_meta: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class GroupMemberItem(BaseModel):
    user_id: UUID
    nama_lengkap: str
    role_label: str
    url_foto: Optional[str] = None
    is_online: bool = False
    is_owner: bool = False

    model_config = ConfigDict(from_attributes=True)


class ConversationItemResponse(BaseModel):
    id: str
    partner_id: Optional[UUID] = None
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
    is_group: bool = False
    member_count: int = 1
    members: Optional[List[GroupMemberItem]] = None

    model_config = ConfigDict(from_attributes=True)