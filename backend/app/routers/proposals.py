from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus, ProjectSlot
from app.models.profile import ProfileMhs
from app.models.proposal import Proposal, ProposalStatus
from app.models.notification import Notification, NotificationType
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.schemas.proposal import ProposalCreateRequest, ProposalResponse, MhsSummary, ProposalResignRequest


router = APIRouter(prefix="/proposals", tags=["Proposals"])


def _build_proposal_response(proposal: Proposal, db: Session, mhs_profile: Optional[ProfileMhs] = None) -> ProposalResponse:
    if not mhs_profile:
        mhs_profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == proposal.mhs_id).first()
    mhs_summary = MhsSummary.model_validate(mhs_profile) if mhs_profile else None

    proj = proposal.project
    slot_nama = proposal.slot.nama_peran if proposal.slot else None

    umkm_nama = None
    umkm_foto = None
    if proj and proj.umkm:
        if proj.umkm.profile_umkm and proj.umkm.profile_umkm.nama_usaha:
            umkm_nama = proj.umkm.profile_umkm.nama_usaha
            umkm_foto = proj.umkm.profile_umkm.url_foto_usaha
        else:
            umkm_nama = proj.umkm.email.split("@")[0]

    return ProposalResponse(
        id=proposal.id,
        project_id=proposal.project_id,
        mhs_id=proposal.mhs_id,
        slot_id=proposal.slot_id,
        slot_nama_peran=slot_nama,
        harga_tawar=proposal.harga_tawar,
        cover_letter=proposal.cover_letter,
        estimasi_hari=proposal.estimasi_hari,
        status=proposal.status,
        withdraw_reason=proposal.withdraw_reason,
        withdrawn_at=proposal.withdrawn_at,
        created_at=proposal.created_at,
        updated_at=proposal.updated_at,
        mhs_profile=mhs_summary,
        project_judul=proj.judul if proj else None,
        project_kategori=proj.kategori.value if (proj and proj.kategori) else None,
        project_status=proj.status.value if (proj and proj.status) else None,
        project_budget_max=proj.budget_max if proj else None,
        project_umkm_nama=umkm_nama,
        project_umkm_foto=umkm_foto,
        project_deskripsi=proj.deskripsi_raw if proj else None,
    )


@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def submit_proposal(
    proposal_request: ProposalCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    # Mahasiswa mengirim proposal lamaran ke project 
    project = db.query(Project).filter(Project.id == proposal_request.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    if project.status not in [ProjectStatus.OPEN, ProjectStatus.BIDDING]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proyek tidak dapat dilamar karena statusnya {project.status.value} dan tidak menerima proposal")

    # Validasi batas tenggat waktu (deadline) proyek
    from datetime import date
    if project.deadline and project.deadline < date.today():
        project.status = ProjectStatus.CANCELLED
        project.cancel_reason = "Tenggat waktu pengerjaan telah berakhir (kedaluwarsa)"
        project.cancelled_by_role = "SYSTEM_EXPIRED"
        project.cancelled_at = func.now()
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenggat waktu pengajuan proposal untuk proyek ini telah berakhir (kedaluwarsa)."
        )

    # Validasi slot jika proyek tim
    if proposal_request.slot_id:
        slot = db.query(ProjectSlot).filter(
            ProjectSlot.id == proposal_request.slot_id,
            ProjectSlot.project_id == project.id
        ).first()
        if not slot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot peran yang dipilih tidak ditemukan dalam proyek ini")
        if slot.status != "OPEN":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Slot peran '{slot.nama_peran}' sudah terisi atau tidak menerima proposal lagi")
        if proposal_request.harga_tawar > slot.alokasi_budget:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Harga tawar (Rp {proposal_request.harga_tawar:,}) melebihi alokasi budget peran '{slot.nama_peran}' (Rp {slot.alokasi_budget:,})"
            )
    else:
        # Validasi budget max proyek reguler
        if proposal_request.harga_tawar > project.budget_max:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Harga tawar (Rp {proposal_request.harga_tawar}) melebihi budget proyek sebesar Rp {project.budget_max}")

    # Cegah lamaran ganda dari mahasiswa yang sama pada proyek/slot yang sama
    filter_expr = [Proposal.project_id == proposal_request.project_id, Proposal.mhs_id == current_user.id]
    if proposal_request.slot_id:
        filter_expr.append(Proposal.slot_id == proposal_request.slot_id)
    existing_proposal = db.query(Proposal).filter(*filter_expr).first()
    if existing_proposal:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Anda sudah mengirim proposal untuk proyek/peran ini")

    # Buat proposal baru
    new_proposal = Proposal(
        project_id=proposal_request.project_id,
        slot_id=proposal_request.slot_id,
        mhs_id=current_user.id,
        harga_tawar=proposal_request.harga_tawar,
        cover_letter=proposal_request.cover_letter,
        estimasi_hari=proposal_request.estimasi_hari,
        status=ProposalStatus.PENDING
    )
    db.add(new_proposal)

    # Update status project menjadi BIDDING jika sebelumnya OPEN
    if project.status == ProjectStatus.OPEN:
        project.status = ProjectStatus.BIDDING

    db.commit()
    db.refresh(new_proposal)

    return _build_proposal_response(new_proposal, db)

@router.get("/my", response_model=List[ProposalResponse])
def get_my_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    proposals = db.query(Proposal).filter(Proposal.mhs_id == current_user.id).order_by(Proposal.created_at.desc()).all()
    profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
    return [_build_proposal_response(p, db, mhs_profile=profile) for p in proposals]

@router.get("/project/{project_id}", response_model=List[ProposalResponse])
def get_proposals_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    # BOLA Guard: Hanya pemilik proyek atau admin yang bisa melihat daftar proposal
    if project.umkm_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk melihat proposal proyek ini")

    proposals = db.query(Proposal).filter(Proposal.project_id == project_id).order_by(Proposal.created_at.desc()).all()
    return [_build_proposal_response(p, db) for p in proposals]

@router.patch("/{id}/accept", response_model=ProposalResponse)
def accept_proposal(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    """
    UMKM Menerima Proposal Mahasiswa:
    1. Validasi kepemilikan proyek.
    2. Cek kecukupan saldo aktif UMKM.
    3. Pindahkan saldo aktif -> saldo escrow (HOLD).
    4. Catat transaksi di ledger_logs.
    5. Ubah status proyek -> IN_PROGRESS.
    6. Tolak otomatis pelamar lain.
    """
    proposal = db.query(Proposal).filter(Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal tidak ditemukan")

    project = db.query(Project).filter(Project.id == proposal.project_id).first()
    if not project.umkm_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk menerima proposal ini")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proposal tidak dapat diterima karena statusnya {proposal.status.value}")

    # Cek saldo aktif UMKM dengan pessimitic Lock
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).with_for_update().first()
    if not wallet or wallet.saldo_aktif < proposal.harga_tawar:
        saldo_saat_ini = int(wallet.saldo_aktif) if wallet and wallet.saldo_aktif else 0
        tawaran = int(proposal.harga_tawar)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo aktif Anda (Rp {saldo_saat_ini:,}) tidak mencukupi untuk mengunci escrow proposal ini (Rp {tawaran:,}). Silakan top-up saldo terlebih dahulu di menu Dompet."
        )

    # Pindahkan saldo aktif -> saldo escrow (HOLD)
    wallet.saldo_aktif -= proposal.harga_tawar
    wallet.saldo_escrow += proposal.harga_tawar

    # Catat transaksi di ledger_logs
    ledger_entry = LedgerLog(
        wallet_id=wallet.id,
        project_id=project.id,
        tipe=TransactionType.HOLD,
        nominal=proposal.harga_tawar,
        keterangan=f"Escrow hold untuk proyek {project.judul} Dikerjakan oleh mahasiswa"
    )
    db.add(ledger_entry)

    # Update status proposal menjadi ACCEPTED
    proposal.status = ProposalStatus.ACCEPTED

    if proposal.slot_id:
        slot = db.query(ProjectSlot).filter(ProjectSlot.id == proposal.slot_id).first()
        if slot:
            slot.status = "IN_PROGRESS"
            slot.accepted_mhs_id = proposal.mhs_id

        # Tolak otomatis proposal lain yang masih PENDING HANYA untuk slot yang sama
        db.query(Proposal).filter(
            Proposal.project_id == project.id,
            Proposal.slot_id == proposal.slot_id,
            Proposal.id != proposal.id,
            Proposal.status == ProposalStatus.PENDING,
        ).update({Proposal.status: ProposalStatus.REJECTED})
    else:
        # Tolak otomatis proposal lain yang masih PENDING untuk proyek reguler
        db.query(Proposal).filter(
            Proposal.project_id == project.id,
            Proposal.id != proposal.id,
            Proposal.status == ProposalStatus.PENDING,
        ).update({Proposal.status: ProposalStatus.REJECTED})

    # Update status project menjadi IN_PROGRESS
    project.status = ProjectStatus.IN_PROGRESS
    db.commit()
    db.refresh(proposal)

    return _build_proposal_response(proposal, db)

@router.patch("/{id}/reject", response_model=ProposalResponse)
def reject_proposal(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    """UMKM Menolak 1 Proposal Lamaran"""
    proposal = db.query(Proposal).filter(Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal tidak ditemukan")

    project = db.query(Project).filter(Project.id == proposal.project_id).first()
    if project.umkm_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda bukan pemilik proyek ini dan tidak memiliki izin untuk menolak proposal ini")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proposal tidak dapat ditolak karena statusnya {proposal.status.value}")

    # Update status proposal menjadi REJECTED
    proposal.status = ProposalStatus.REJECTED
    db.commit()
    db.refresh(proposal)

    return _build_proposal_response(proposal, db)


@router.patch("/{id}/withdraw", response_model=ProposalResponse)
def withdraw_proposal(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    """Mahasiswa Menarik Proposal yang masih PENDING"""
    proposal = db.query(Proposal).filter(Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal tidak ditemukan")

    if proposal.mhs_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk menarik proposal ini")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Hanya proposal dengan status PENDING yang dapat ditarik. Status saat ini: {proposal.status.value}")

    proposal.status = ProposalStatus.WITHDRAWN
    proposal.withdrawn_at = func.now()
    db.commit()
    db.refresh(proposal)

    return _build_proposal_response(proposal, db)


@router.post("/{id}/resign", response_model=ProposalResponse)
def resign_from_accepted_project(
    id: UUID,
    body: ProposalResignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    proposal = db.query(Proposal).filter(Proposal.id == id, Proposal.mhs_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal tidak ditemukan atau bukan milik Anda")

    if proposal.status != ProposalStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hanya proposal dengan status 'ACCEPTED' yang dapat diajukan pengunduran diri. Status saat ini: {proposal.status.value}"
        )

    project = db.query(Project).filter(Project.id == proposal.project_id).first()
    if not project or project.status != ProjectStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proyek tidak dalam status 'IN_PROGRESS'"
        )

    # Kembalikan dana escrow UMKM ke saldo aktif UMKM
    wallet = db.query(Wallet).filter(Wallet.user_id == project.umkm_id).with_for_update().first()
    if wallet and wallet.saldo_escrow >= proposal.harga_tawar:
        wallet.saldo_escrow -= proposal.harga_tawar
        wallet.saldo_aktif += proposal.harga_tawar

        ledger_entry = LedgerLog(
            wallet_id=wallet.id,
            project_id=project.id,
            tipe=TransactionType.REFUND,
            nominal=proposal.harga_tawar,
            keterangan=f"Pengembalian escrow proyek '{project.judul}' ke saldo aktif karena pengunduran diri mahasiswa"
        )
        db.add(ledger_entry)

    # Ubah status proposal menjadi WITHDRAWN
    proposal.status = ProposalStatus.WITHDRAWN
    proposal.withdraw_reason = body.reason
    proposal.withdrawn_at = func.now()

    # Catat audit pembatalan pada proyek
    project.cancel_reason = f"Mahasiswa mengundurkan diri: {body.reason}"
    project.cancelled_by_role = "MAHASISWA"
    project.cancelled_at = func.now()

    if proposal.slot_id:
        slot = db.query(ProjectSlot).filter(ProjectSlot.id == proposal.slot_id).first()
        if slot:
            slot.status = "OPEN"
            slot.accepted_mhs_id = None
        active_slots_count = db.query(ProjectSlot).filter(
            ProjectSlot.project_id == project.id,
            ProjectSlot.status == "IN_PROGRESS"
        ).count()
        if active_slots_count == 0:
            project.status = ProjectStatus.OPEN
    else:
        project.status = ProjectStatus.OPEN

    # Ambil nama mahasiswa
    profile_mhs = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
    nama_mhs = profile_mhs.nama_lengkap if profile_mhs else current_user.email

    from datetime import date
    is_deadline_valid = project.deadline and project.deadline >= date.today()
    if is_deadline_valid:
        keterangan_tenggat = "Dana escrow telah dikembalikan ke Saldo Aktif Anda dan proyek telah dibuka kembali ke katalog eksplorasi."
    else:
        keterangan_tenggat = "Dana escrow telah dikembalikan ke Saldo Aktif Anda. Karena tenggat waktu pengerjaan sebelumnya telah lewat, silakan perbarui tenggat waktu baru agar proyek dapat ditayangkan kembali di katalog eksplorasi."

    # Kirim notifikasi ke UMKM
    notif_umkm = Notification(
        user_id=project.umkm_id,
        judul="Mahasiswa Mengundurkan Diri dari Proyek",
        pesan=f"Mahasiswa {nama_mhs} mengundurkan diri dari proyek '{project.judul}'. Alasan: {body.reason}. {keterangan_tenggat}",
        tipe=NotificationType.PROPOSAL,
        url_referensi=f"/workroom/{project.id}"
    )
    db.add(notif_umkm)

    # Kirim notifikasi ke Mahasiswa
    notif_mhs = Notification(
        user_id=current_user.id,
        judul="Pengunduran Diri Berhasil",
        pesan=f"Anda telah mengundurkan diri dari proyek '{project.judul}'. Status penugasan Anda telah berakhir.",
        tipe=NotificationType.PROPOSAL,
        url_referensi="/proposals"
    )
    db.add(notif_mhs)

    db.commit()
    db.refresh(proposal)

    return _build_proposal_response(proposal, db, mhs_profile=profile_mhs)