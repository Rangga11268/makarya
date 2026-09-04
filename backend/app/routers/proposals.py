from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.profile import ProfileMhs
from app.models.proposal import Proposal, ProposalStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.schemas.proposal import ProposalCreateRequest, ProposalResponse, MhsSummary


router = APIRouter(prefix="/proposals", tags=["Proposals"])

@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def submit_proposal(
    proposal_request: ProposalCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    # Mahasiswa megirim proposal lamaran ke project 
    # Cek keberadaan project
    project = db.query(Project).filter(Project.id == proposal_request.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")
    # Validasi status project (hanya bisa dilamar jika open atau bidding)
    if project.status not in [ProjectStatus.OPEN, ProjectStatus.BIDDING]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proyek tidak dapat dilamar karena statusnya {project.status.value} dan tidak menerima proposal")

    # Validasi budget max (harga tawar tidak boleh melebihi budget UMKM)
    if proposal_request.harga_tawar > project.budget_max:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Harga tawar (Rp {proposal_request.harga_tawar}) melebihi budget proyek sebesar Rp {project.budget_max}")

    # Cegah lamaran ganda dari mahasiswa yang sama pada proyek yang sama
    existing_proposal = db.query(Proposal).filter(
        Proposal.project_id == proposal_request.project_id,
        Proposal.mhs_id == current_user.id
    ).first()
    if existing_proposal:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Anda sudah mengirim proposal untuk proyek ini")

    # Buat proposal baru
    new_proposal = Proposal(
        project_id=proposal_request.project_id,
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

    # Ambil data profile mahasiswa pengirim
    profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
    mhs_summary = MhsSummary.model_validate(profile) if profile else None

    return ProposalResponse(
        id=new_proposal.id,
        project_id=new_proposal.project_id,
        mhs_id=new_proposal.mhs_id,
        harga_tawar=new_proposal.harga_tawar,
        cover_letter=new_proposal.cover_letter,
        estimasi_hari=new_proposal.estimasi_hari,
        status=new_proposal.status,
        created_at=new_proposal.created_at,
        updated_at=new_proposal.updated_at,
        mhs_profile=mhs_summary
    )

@router.get("/my", response_model=List[ProposalResponse])
def get_my_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS))
):
    # Melihat seluruh proposal yang dikirim oleh mahasiswa yang sedang login
    proposals = db.query(Proposal).filter(Proposal.mhs_id == current_user.id).order_by(Proposal.created_at.desc()).all()
    profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
    mhs_summary = MhsSummary.model_validate(profile) if profile else None

    results = []
    for proposal in proposals:
        proj = proposal.project
        results.append(ProposalResponse(
            id=proposal.id,
            project_id=proposal.project_id,
            mhs_id=proposal.mhs_id,
            harga_tawar=proposal.harga_tawar,
            cover_letter=proposal.cover_letter,
            estimasi_hari=proposal.estimasi_hari,
            status=proposal.status,
            created_at=proposal.created_at,
            updated_at=proposal.updated_at,
            mhs_profile=mhs_summary,
            project_judul=proj.judul if proj else None,
            project_kategori=proj.kategori.value if proj and proj.kategori else None,
            project_status=proj.status.value if proj and proj.status else None,
            project_budget_max=proj.budget_max if proj else None,
            project_umkm_nama=(
                proj.umkm.profile_umkm.nama_usaha
                if (proj and proj.umkm and proj.umkm.profile_umkm and proj.umkm.profile_umkm.nama_usaha)
                else (proj.umkm.email.split("@")[0] if proj and proj.umkm else None)
            ),
            project_deskripsi=proj.deskripsi_raw if proj else None,
        ))
    return results

@router.get("/project/{project_id}", response_model=List[ProposalResponse])
def get_proposals_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # UMKM Melihat daftar seluruh proposal yang masuk ke proyek yang dimilikinya
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    # BOLA Guard: Hanya pemilik proyek atau admin yang bisa melihat daftar proposal
    if project.umkm_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk melihat proposal proyek ini")

    proposals = db.query(Proposal).filter(Proposal.project_id == project_id).order_by(Proposal.created_at.desc()).all()
    results = []
    for proposal in proposals:
        profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == proposal.mhs_id).first()
        mhs_summary = MhsSummary.model_validate(profile) if profile else None
        results.append(ProposalResponse(
            id=proposal.id,
            project_id=proposal.project_id,
            mhs_id=proposal.mhs_id,
            harga_tawar=proposal.harga_tawar,
            cover_letter=proposal.cover_letter,
            estimasi_hari=proposal.estimasi_hari,
            status=proposal.status,
            created_at=proposal.created_at,
            updated_at=proposal.updated_at,
            mhs_profile=mhs_summary,
            project_judul=project.judul,
            project_kategori=project.kategori.value if project.kategori else None,
            project_status=project.status.value if project.status else None,
            project_budget_max=project.budget_max,
            project_umkm_nama=(
                project.umkm.profile_umkm.nama_usaha
                if (project and project.umkm and project.umkm.profile_umkm and project.umkm.profile_umkm.nama_usaha)
                else (project.umkm.email.split("@")[0] if project.umkm else None)
            ),
            project_deskripsi=project.deskripsi_raw if project else None,
        ))
    return results

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

    # Tolak otomatis proposal lain yang masih PENDING untuk proyek yang sama
    db.query(Proposal).filter(
        Proposal.project_id == project.id,
        Proposal.id != proposal.id,
        Proposal.status == ProposalStatus.PENDING,
    ).update({Proposal.status: ProposalStatus.REJECTED})

    # Update status project menjadi IN_PROGRESS
    project.status = ProjectStatus.IN_PROGRESS
    db.commit()
    db.refresh(proposal)

    profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == proposal.mhs_id).first()
    mhs_summary = MhsSummary.model_validate(profile) if profile else None

    umkm_nama = (
        project.umkm.profile_umkm.nama_usaha
        if (project and project.umkm and project.umkm.profile_umkm)
        else (project.umkm.username if (project and project.umkm) else None)
    )

    return ProposalResponse(
        id=proposal.id,
        project_id=proposal.project_id,
        mhs_id=proposal.mhs_id,
        harga_tawar=proposal.harga_tawar,
        cover_letter=proposal.cover_letter,
        estimasi_hari=proposal.estimasi_hari,
        status=proposal.status,
        created_at=proposal.created_at,
        updated_at=proposal.updated_at,
        mhs_profile=mhs_summary,
        project_judul=project.judul if project else None,
        project_kategori=project.kategori.value if (project and project.kategori) else None,
        project_status=project.status.value if (project and project.status) else None,
        project_budget_max=project.budget_max if project else None,
        project_umkm_nama=umkm_nama,
    )

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

    profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == proposal.mhs_id).first()
    mhs_summary = MhsSummary.model_validate(profile) if profile else None

    umkm_nama = (
        project.umkm.profile_umkm.nama_usaha
        if (project and project.umkm and project.umkm.profile_umkm)
        else (project.umkm.username if (project and project.umkm) else None)
    )

    return ProposalResponse(
        id=proposal.id,
        project_id=proposal.project_id,
        mhs_id=proposal.mhs_id,
        harga_tawar=proposal.harga_tawar,
        cover_letter=proposal.cover_letter,
        estimasi_hari=proposal.estimasi_hari,
        status=proposal.status,
        created_at=proposal.created_at,
        updated_at=proposal.updated_at,
        mhs_profile=mhs_summary,
        project_judul=project.judul if project else None,
        project_kategori=project.kategori.value if (project and project.kategori) else None,
        project_status=project.status.value if (project and project.status) else None,
        project_budget_max=project.budget_max if project else None,
        project_umkm_nama=umkm_nama,
    )