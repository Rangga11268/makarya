import uuid
from typing import List, Optional
from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.certificate import Certificate
from app.schemas.certificate import (
    CertificateResponse,
    CertificateToggleShowcaseRequest,
    CertificateVerifyResponse,
)

router = APIRouter(prefix="/certificates", tags=["Certificates & Portfolio Showcase"])


def generate_credential_id(project: Project, role_name: str, proposal_id: UUID) -> str:
    year = datetime.now().year
    role_slug = "".join(c for c in role_name.upper() if c.isalnum())[:4] or "TALENT"
    unique_suffix = str(proposal_id).replace("-", "")[:6].upper()
    return f"MKY-{year}-{role_slug}-{unique_suffix}"


def issue_certificate_for_proposal(db: Session, proposal: Proposal, submission: Optional[Submission] = None) -> Certificate:
    existing = db.query(Certificate).filter(Certificate.proposal_id == proposal.id).first()
    if existing:
        return existing

    project = proposal.project
    mhs = proposal.mahasiswa
    profile = mhs.profile_mhs if mhs else None
    slot = proposal.slot

    recipient_name = (
        profile.nama_lengkap
        if profile and profile.nama_lengkap
        else (mhs.username if mhs else "Mahasiswa Talenta")
    )
    recipient_prodi = profile.prodi.nama_prodi if (profile and profile.prodi) else "Informatika"

    recipient_kampus = "Universitas Terdaftar"
    if mhs and mhs.email:
        email_domain = mhs.email.split("@")[-1].lower()
        if "ubsi" in email_domain:
            recipient_kampus = "Universitas Bina Sarana Informatika (UBSI)"
        elif "ui.ac.id" in email_domain:
            recipient_kampus = "Universitas Indonesia (UI)"
        elif "itb.ac.id" in email_domain:
            recipient_kampus = "Institut Teknologi Bandung (ITB)"
        elif "ugm.ac.id" in email_domain:
            recipient_kampus = "Universitas Gadjah Mada (UGM)"
        else:
            recipient_kampus = f"Kampus @{email_domain}"

    role_name = slot.nama_peran if slot and slot.nama_peran else "Pelaksana Proyek"
    project_title = project.judul if project else "Proyek Kemitraan UMKM"

    client = project.umkm if project else None
    client_profile = client.profile_umkm if client else None
    client_name = (
        client_profile.nama_usaha
        if client_profile and client_profile.nama_usaha
        else (client.nama if client and hasattr(client, "nama") and client.nama else "Mitra Usaha UMKM")
    )

    credential_id = generate_credential_id(project, role_name, proposal.id)

    file_url = submission.url_berkas if submission else None

    cert = Certificate(
        credential_id=credential_id,
        mhs_id=proposal.mhs_id,
        project_id=proposal.project_id,
        proposal_id=proposal.id,
        recipient_name=recipient_name,
        recipient_kampus=recipient_kampus,
        recipient_prodi=recipient_prodi,
        role_name=role_name,
        project_title=project_title,
        client_name=client_name,
        project_category=project.kategori.value if project and project.kategori else None,
        is_showcase=True,
        showcase_description=f"Berhasil menyelesaikan penugasan {role_name} untuk proyek {project_title} bersama {client_name}.",
        showcase_url=file_url,
        deliverable_url=file_url,
        issued_at=datetime.now(timezone.utc),
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.get("/my", response_model=List[CertificateResponse])
def get_my_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS)),
):
    """Mendapatkan seluruh sertifikat digital milik mahasiswa yang sedang login"""
    certs = (
        db.query(Certificate)
        .filter(Certificate.mhs_id == current_user.id)
        .order_by(Certificate.issued_at.desc())
        .all()
    )

    # Retroactive auto-issue: jika mahasiswa memiliki proposal yang selesai / submission APPROVED tapi belum punya cert
    completed_proposals = (
        db.query(Proposal)
        .filter(
            Proposal.mhs_id == current_user.id,
            Proposal.status == ProposalStatus.ACCEPTED,
        )
        .all()
    )

    existing_prop_ids = {c.proposal_id for c in certs}
    new_issued = False
    for prop in completed_proposals:
        if prop.id not in existing_prop_ids:
            sub = db.query(Submission).filter(Submission.proposal_id == prop.id).first()
            if sub and sub.status == SubmissionStatus.APPROVED:
                issue_certificate_for_proposal(db, prop, sub)
                new_issued = True

    if new_issued:
        certs = (
            db.query(Certificate)
            .filter(Certificate.mhs_id == current_user.id)
            .order_by(Certificate.issued_at.desc())
            .all()
        )

    return certs


@router.get("/project/{project_id}", response_model=Optional[CertificateResponse])
def get_certificate_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mendapatkan sertifikat untuk proyek tertentu"""
    proposal = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project_id,
            Proposal.mhs_id == current_user.id,
        )
        .first()
    )
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal tidak ditemukan")

    cert = db.query(Certificate).filter(Certificate.proposal_id == proposal.id).first()
    if not cert:
        # Check if submission is approved to generate on demand
        sub = db.query(Submission).filter(Submission.proposal_id == proposal.id).first()
        if sub and sub.status == SubmissionStatus.APPROVED:
            cert = issue_certificate_for_proposal(db, proposal, sub)

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sertifikat belum diterbitkan untuk proyek ini",
        )

    return cert


@router.patch("/{id}/toggle-showcase", response_model=CertificateResponse)
def toggle_showcase(
    id: UUID,
    body: CertificateToggleShowcaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS)),
):
    """Mahasiswa mengubah visibilitas sertifikat & proyek di portofolio publik"""
    cert = db.query(Certificate).filter(Certificate.id == id).first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sertifikat tidak ditemukan")

    if cert.mhs_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda bukan pemilik sertifikat ini")

    cert.is_showcase = body.is_showcase
    if body.showcase_description is not None:
        cert.showcase_description = body.showcase_description
    if body.showcase_url is not None:
        cert.showcase_url = body.showcase_url

    db.commit()
    db.refresh(cert)
    return cert


@router.get("/verify/{credential_id}", response_model=CertificateVerifyResponse)
def verify_certificate(credential_id: str, db: Session = Depends(get_db)):
    """Verifikasi publik keaslian sertifikat digital Makarya"""
    clean_id = credential_id.strip().upper()
    cert = db.query(Certificate).filter(Certificate.credential_id == clean_id).first()
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sertifikat dengan ID kredensial '{credential_id}' tidak ditemukan di database resmi Makarya.",
        )

    project = cert.project
    proposal = cert.proposal

    team_breakdown = None
    if project and (project.tipe_kolaborasi == "TIM" or (project.slots and len(project.slots) > 0)):
        team_breakdown = []
        for s in project.slots:
            assigned_name = None
            if s.accepted_mhs_id:
                mhs_user = db.query(User).filter(User.id == s.accepted_mhs_id).first()
                if mhs_user:
                    assigned_name = (
                        mhs_user.profile_mhs.nama_lengkap
                        if (mhs_user.profile_mhs and mhs_user.profile_mhs.nama_lengkap)
                        else mhs_user.username
                    )
            team_breakdown.append({
                "nama_peran": s.nama_peran,
                "alokasi_budget": s.alokasi_budget,
                "status": s.status,
                "mhs_nama": assigned_name,
            })

    honor = proposal.harga_tawar if proposal and proposal.harga_tawar is not None else (
        proposal.slot.alokasi_budget if (proposal and proposal.slot) else (project.budget_max if project else None)
    )
    slot_budget = proposal.slot.alokasi_budget if (proposal and proposal.slot) else None
    total_budget = project.budget_max if project else None
    collab_type = project.tipe_kolaborasi if project else "INDIVIDU"

    return {
        "is_valid": True,
        "credential_id": cert.credential_id,
        "recipient_name": cert.recipient_name,
        "recipient_kampus": cert.recipient_kampus,
        "recipient_prodi": cert.recipient_prodi,
        "role_name": cert.role_name,
        "project_title": cert.project_title,
        "client_name": cert.client_name,
        "client_signature_url": cert.client_signature_url,
        "project_category": cert.project_category,
        "issued_at": cert.issued_at,
        "deliverable_url": cert.deliverable_url if cert.is_showcase else None,
        "honor_amount": honor,
        "slot_budget": slot_budget,
        "total_project_budget": total_budget,
        "collaboration_type": collab_type,
        "team_breakdown": team_breakdown,
        "status_text": "Resmi Terverifikasi oleh Makarya",
    }


@router.get("/user/{user_id}/showcase", response_model=List[CertificateResponse])
def get_user_showcase(user_id: UUID, db: Session = Depends(get_db)):
    """Mendapatkan portofolio & sertifikat yang di-showcase publik oleh seorang mahasiswa"""
    certs = (
        db.query(Certificate)
        .filter(Certificate.mhs_id == user_id, Certificate.is_showcase == True)
        .order_by(Certificate.issued_at.desc())
        .all()
    )
    return certs
