from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional
from typing import Optional, List, Dict, Any


class CertificateToggleShowcaseRequest(BaseModel):
    is_showcase: bool
    showcase_description: Optional[str] = None
    showcase_url: Optional[str] = None


class CertificateResponse(BaseModel):
    id: UUID
    credential_id: str
    mhs_id: UUID
    project_id: UUID
    proposal_id: UUID
    recipient_name: str
    recipient_kampus: str
    recipient_prodi: str
    role_name: str
    project_title: str
    client_name: str
    project_category: Optional[str] = None
    is_showcase: bool
    showcase_description: Optional[str] = None
    showcase_url: Optional[str] = None
    deliverable_url: Optional[str] = None
    honor_amount: Optional[Decimal] = None
    slot_budget: Optional[Decimal] = None
    total_project_budget: Optional[Decimal] = None
    collaboration_type: Optional[str] = None
    issued_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CertificateVerifyResponse(BaseModel):
    is_valid: bool
    credential_id: str
    recipient_name: str
    recipient_kampus: str
    recipient_prodi: str
    role_name: str
    project_title: str
    client_name: str
    project_category: Optional[str] = None
    issued_at: datetime
    deliverable_url: Optional[str] = None
    honor_amount: Optional[Decimal] = None
    slot_budget: Optional[Decimal] = None
    total_project_budget: Optional[Decimal] = None
    collaboration_type: Optional[str] = None
    team_breakdown: Optional[List[Dict[str, Any]]] = None
    status_text: str = "Resmi Terverifikasi oleh Makarya"

    model_config = ConfigDict(from_attributes=True)
