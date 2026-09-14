from datetime import datetime
from typing import Optional
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from app.models.escrow import EscrowStatus


class EscrowResponse(BaseModel):
    id: UUID
    project_id: UUID
    proposal_id: Optional[UUID] = None
    client_id: UUID
    talent_id: UUID

    amount_total: Decimal
    platform_fee: Decimal
    amount_talent: Decimal

    status: EscrowStatus
    auto_approve_at: Optional[datetime] = None

    created_at: datetime
    updated_at: Optional[datetime] = None
    released_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class EscrowDetailResponse(EscrowResponse):
    project_judul: Optional[str] = None
    client_nama: Optional[str] = None
    talent_nama: Optional[str] = None

