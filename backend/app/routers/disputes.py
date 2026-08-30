from datetime import datetime, timezone
from typing import List
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.dispute import Dispute, DisputeStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.schemas.dispute import DisputeCreateRequest, DisputeResolveRequest, DisputeResponse

router = APIRouter(prefix="/disputes", tags=["Dispute Resolution"])


@router.post("", response_model=DisputeResponse, status_code=status.HTTP_201_CREATED)
def file_dispute(
    body: DisputeCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mengajukan Tiket Sengketa (Dispute).
    Dapat diajukan oleh UMKM atau Mahasiswa yang sedang dalam proyek IN_PROGRESS.
    """
    project = db.query(Project).filter(Project.id == body.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    accepted_proposal = (
        db.query(Proposal)
        .filter(Proposal.project_id == project.id, Proposal.status == ProposalStatus.ACCEPTED)
        .first()
    )
    if not accepted_proposal:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Proyek ini belum memiliki kesepakatan kerja")

    # Validasi pihak yang terlibat
    is_umkm = project.umkm_id == current_user.id
    is_mhs = accepted_proposal.mhs_id == current_user.id
    if not is_umkm and not is_mhs:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda bukan pihak yang terlibat dalam proyek ini")

    # Cegah tiket sengketa dobel yang masih berjalan
    existing_dispute = (
        db.query(Dispute)
        .filter(Dispute.project_id == project.id, Dispute.status != DisputeStatus.RESOLVED)
        .first()
    )
    if existing_dispute:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Proyek ini sudah memiliki tiket sengketa yang sedang diproses")

    # Buat Dispute Baru
    new_dispute = Dispute(
        project_id=project.id,
        pelapor_id=current_user.id,
        alasan=body.alasan,
        status=DisputeStatus.OPEN,
    )
    db.add(new_dispute)
    db.commit()
    db.refresh(new_dispute)
    return new_dispute


@router.get("", response_model=List[DisputeResponse])
def get_all_disputes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """Admin Melihat Seluruh Daftar Sengketa yang Masuk"""
    disputes = db.query(Dispute).order_by(Dispute.created_at.desc()).all()
    return disputes


@router.patch("/{id}/resolve", response_model=DisputeResponse)
def resolve_dispute(
    id: UUID,
    body: DisputeResolveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """
    Admin Menyelesaikan Sengketa & Eksekusi Pembagian Saldo Escrow (Split Escrow Resolution):
    1. Hitung pembagian nominal berdasarkan persentase (% UMKM & % Mahasiswa).
    2. Kurangi saldo_escrow UMKM.
    3. Refund porsi UMKM ke saldo_aktif UMKM.
    4. Cairkan porsi Mahasiswa ke saldo_aktif Mahasiswa.
    5. Catat transaksi di LedgerLog (REFUND & RELEASE).
    6. Selesaikan status proyek & tiket sengketa.
    """
    dispute = db.query(Dispute).filter(Dispute.id == id).first()
    if not dispute:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tiket sengketa tidak ditemukan")

    if dispute.status == DisputeStatus.RESOLVED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sengketa ini sudah diselesaikan sebelumnya")

    project = db.query(Project).filter(Project.id == dispute.project_id).first()
    accepted_proposal = (
        db.query(Proposal)
        .filter(Proposal.project_id == project.id, Proposal.status == ProposalStatus.ACCEPTED)
        .first()
    )
    if not accepted_proposal:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Data proposal terkait tidak ditemukan")

    total_escrow = accepted_proposal.harga_tawar

    # 1. Hitung Nominal Pembagian
    nominal_klien = (body.persentase_klien / Decimal("100")) * total_escrow
    nominal_mhs = (body.persentase_freelancer / Decimal("100")) * total_escrow

    # 2. Kunci Dompet Kedua Pihak dengan Pessimistic Lock
    umkm_wallet = db.query(Wallet).filter(Wallet.user_id == project.umkm_id).with_for_update().first()
    mhs_wallet = db.query(Wallet).filter(Wallet.user_id == accepted_proposal.mhs_id).with_for_update().first()

    if not umkm_wallet or umkm_wallet.saldo_escrow < total_escrow:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Saldo escrow tidak mencukupi untuk diselesaikan")

    # 3. Eksekusi Perpindahan Saldo
    umkm_wallet.saldo_escrow -= total_escrow
    umkm_wallet.saldo_aktif += nominal_klien
    mhs_wallet.saldo_aktif += nominal_mhs

    # 4. Catat Mutasi Buku Besar (Audit Trail)
    if nominal_klien > 0:
        log_klien = LedgerLog(
            wallet_id=umkm_wallet.id,
            project_id=project.id,
            tipe=TransactionType.REFUND,
            nominal=nominal_klien,
            keterangan=f"Refund hasil mediasi sengketa proyek '{project.judul}' ({body.persentase_klien}%)",
        )
        db.add(log_klien)

    if nominal_mhs > 0:
        log_mhs = LedgerLog(
            wallet_id=mhs_wallet.id,
            project_id=project.id,
            tipe=TransactionType.RELEASE,
            nominal=nominal_mhs,
            keterangan=f"Pencairan honor hasil mediasi sengketa proyek '{project.judul}' ({body.persentase_freelancer}%)",
        )
        db.add(log_mhs)

    # 5. Update Status Dispute & Proyek
    dispute.status = DisputeStatus.RESOLVED
    dispute.keputusan_admin = body.keputusan_admin
    dispute.persentase_klien = body.persentase_klien
    dispute.persentase_freelancer = body.persentase_freelancer
    dispute.resolved_at = datetime.now(timezone.utc)

    project.status = ProjectStatus.DONE

    db.commit()
    db.refresh(dispute)
    return dispute