from datetime import date
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.dependencies import get_current_user, require_role, get_optional_current_user
from app.models.user import User, UserRole
from app.models.project import Project, ProjectCategory, ProjectStatus
from app.models.profile import ProfileUmkm, ProfileMhs
from app.models.proposal import Proposal, ProposalStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.models.notification import Notification, NotificationType
from app.schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectResponse,
    UmkmSummary,
    ProjectReopenRequest,
    ProjectTerminateRequest,
)


router = APIRouter(prefix="/projects", tags=["Projects"])


def _resolve_accepted_mhs(proj_id: UUID, db: Session):
    accepted_prop = (
        db.query(Proposal)
        .filter(Proposal.project_id == proj_id, Proposal.status == ProposalStatus.ACCEPTED)
        .first()
    )
    if accepted_prop:
        mhs_profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == accepted_prop.mhs_id).first()
        if mhs_profile:
            return (mhs_profile.nama_lengkap, mhs_profile.url_foto)
    return (None, None)


def _calculate_match_score(proj: Project, mhs_profile: Optional[ProfileMhs]):
    if not mhs_profile:
        return (None, None)

    score = 45
    reasons = []

    proj_cat = proj.kategori.value.lower() if hasattr(proj.kategori, "value") else str(proj.kategori).lower()
    proj_text = f"{proj.judul} {proj.deskripsi_raw}".lower()

    skills = mhs_profile.skills or []
    matched_skills = []
    category_matched = False

    for ms in skills:
        s_name = ms.skill.nama_skill if ms.skill else ""
        s_cat = ms.skill.kategori.lower() if ms.skill and ms.skill.kategori else ""

        if s_cat and (s_cat in proj_cat or proj_cat in s_cat):
            category_matched = True

        if s_name and (s_name.lower() in proj_text or s_name.lower() in proj_cat):
            matched_skills.append(s_name)
            level_val = ms.tingkat.value if hasattr(ms.tingkat, "value") else str(ms.tingkat)
            if level_val == "ADVANCED":
                score += 15
            elif level_val == "INTERMEDIATE":
                score += 10
            else:
                score += 8

    if category_matched:
        score += 25
        cat_display = proj.kategori.value if hasattr(proj.kategori, "value") else str(proj.kategori)
        reasons.append(f"Kategori sesuai ({cat_display})")

    if matched_skills:
        unique_skills = list(dict.fromkeys(matched_skills))[:3]
        reasons.append(f"Keahlian cocok: {', '.join(unique_skills)}")

    if mhs_profile.total_proyek_selesai and mhs_profile.total_proyek_selesai > 0:
        score += 8
        reasons.append(f"Rekam jejak ({mhs_profile.total_proyek_selesai} proyek)")

    if mhs_profile.rating_avg and float(mhs_profile.rating_avg) >= 4.5:
        score += 7
        reasons.append(f"Rating tinggi ({float(mhs_profile.rating_avg):.1f} / 5.0)")

    if not category_matched and not matched_skills:
        final_score = min(score, 50)
    else:
        final_score = min(max(score, 60), 98)

    if not reasons:
        reasons.append("Proyek terbuka untuk umum")

    return (final_score, reasons)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreateRequest,
    db = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    # Membuat proyek baru (Khusus klien UMKM terverifikasi)
    new_project = Project(
        umkm_id=current_user.id,
        judul=body.judul,
        deskripsi_raw=body.deskripsi_raw,
        kategori=body.kategori,
        budget_max=body.budget_max,
        deadline=body.deadline,
        status=ProjectStatus.OPEN,
    )

    # Ambil profile UMKM pembuat proyek
    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == current_user.id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None

    return ProjectResponse(
        id=new_project.id,
        umkm_id=new_project.umkm_id,
        judul=new_project.judul,
        deskripsi_raw=new_project.deskripsi_raw,
        kategori=new_project.kategori,
        budget_max=new_project.budget_max,
        deadline=new_project.deadline,
        status=new_project.status,
        created_at=new_project.created_at,
        updated_at=new_project.updated_at,
        umkm_profile=umkm_summary,
        umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
        total_pelamar=0
    )

@router.get("", response_model=List[ProjectResponse])
def browse_project(
    kategori: Optional[ProjectCategory] = Query(None, description="Filter Berdasarkan kategori"),
    min_budget: Optional[Decimal] = Query(None, ge=0, description="Filter Berdasarkan budget minimum"),
    max_budget: Optional[Decimal] = Query(None, le=2000000, description="Filter Berdasarkan budget maksimum"),
    keyword: Optional[str] = Query(None, description="Filter Berdasarkan keyword, Judul atau deskripsi proyek"),
    status: Optional[ProjectStatus] = Query(None, description="Default OPEN, Filter Berdasarkan status proyek"),
    skip: int = Query(0, ge=0, description="Jumlah data yang dilewati"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah data yang diambil"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    from datetime import date
    today = date.today()
    query = db.query(Project)
    if status:
        query = query.filter(Project.status == status)
        if status in [ProjectStatus.OPEN, ProjectStatus.BIDDING]:
            query = query.filter(Project.deadline >= today)
    if kategori:
        query = query.filter(Project.kategori == kategori)
    if min_budget is not None:
        query = query.filter(Project.budget_max >= min_budget)
    if max_budget is not None:
        query = query.filter(Project.budget_max <= max_budget)
    if keyword:
        search = f"%{keyword}%"
        query = query.filter(or_(Project.judul.ilike(search), Project.deskripsi_raw.ilike(search)))

    projects = query.offset(skip).limit(limit).all()

    mhs_profile = None
    if current_user and current_user.role == UserRole.MHS:
        mhs_profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()

    results = []
    for proj in projects:
        profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == proj.umkm_id).first()
        umkm_summary = UmkmSummary.model_validate(profile) if profile else None
        total_pelamar = db.query(Proposal).filter(Proposal.project_id == proj.id).count()
        acc_nama, acc_foto = _resolve_accepted_mhs(proj.id, db)
        match_score, match_reasons = _calculate_match_score(proj, mhs_profile)

        results.append(ProjectResponse(
            id=proj.id,
            umkm_id=proj.umkm_id,
            judul=proj.judul,
            deskripsi_raw=proj.deskripsi_raw,
            kategori=proj.kategori,
            budget_max=proj.budget_max,
            deadline=proj.deadline,
            status=proj.status,
            created_at=proj.created_at,
            updated_at=proj.updated_at,
            umkm_profile=umkm_summary,
            umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
            accepted_mhs_nama=acc_nama,
            accepted_mhs_foto=acc_foto,
            total_pelamar=total_pelamar,
            match_score=match_score,
            match_reasons=match_reasons,
        ))
    return results


@router.get("/my-projects", response_model=List[ProjectResponse])
@router.get("/my", response_model=List[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    # Melihat seluruh proyek yang dibuat oleh UMKM yang sedang login
    projects = db.query(Project).filter(Project.umkm_id == current_user.id).all()
    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == current_user.id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None

    results = []
    for proj in projects:
        total_pelamar = db.query(Proposal).filter(Proposal.project_id == proj.id).count()
        acc_nama, acc_foto = _resolve_accepted_mhs(proj.id, db)
        results.append(ProjectResponse(
            id=proj.id,
            umkm_id=proj.umkm_id,
            judul=proj.judul,
            deskripsi_raw=proj.deskripsi_raw,
            kategori=proj.kategori,
            budget_max=proj.budget_max,
            deadline=proj.deadline,
            status=proj.status,
            created_at=proj.created_at,
            updated_at=proj.updated_at,
            umkm_profile=umkm_summary,
            umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
            accepted_mhs_nama=acc_nama,
            accepted_mhs_foto=acc_foto,
            total_pelamar=total_pelamar
        ))
    return results

@router.get("/{id}", response_model=ProjectResponse)
def get_project_by_id(
    # Melihat detail proyek berdasarkan ID
    id: UUID,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    from datetime import date
    if project.status in [ProjectStatus.OPEN, ProjectStatus.BIDDING] and project.deadline and project.deadline < date.today():
        project.status = ProjectStatus.CANCELLED
        for prop in project.proposals:
            if prop.status == ProposalStatus.PENDING:
                prop.status = ProposalStatus.REJECTED
        db.commit()
        db.refresh(project)

    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == project.umkm_id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None
    total_pelamar = db.query(Proposal).filter(Proposal.project_id == project.id).count()
    acc_nama, acc_foto = _resolve_accepted_mhs(project.id, db)

    mhs_profile = None
    if current_user and current_user.role == UserRole.MHS:
        mhs_profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()

    match_score, match_reasons = _calculate_match_score(project, mhs_profile)

    return ProjectResponse(
        id=project.id,
        umkm_id=project.umkm_id,
        judul=project.judul,
        deskripsi_raw=project.deskripsi_raw,
        kategori=project.kategori,
        budget_max=project.budget_max,
        deadline=project.deadline,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        umkm_profile=umkm_summary,
        umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
        accepted_mhs_nama=acc_nama,
        accepted_mhs_foto=acc_foto,
        total_pelamar=total_pelamar,
        match_score=match_score,
        match_reasons=match_reasons,
    )

@router.patch("/{id}", response_model=ProjectResponse)
def update_project(
    id: UUID,
    body: ProjectUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    # Mengupdate proyek yang dibuat oleh UMKM yang sedang login
    project = db.query(Project).filter(Project.id == id, Project.umkm_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan atau Anda tidak memiliki izin untuk mengubah proyek ini")

    #  BOLA / IDOR Check cek apakah user yang benar-benar pemilik proyek ini
    if project.umkm_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk mengubah proyek ini")

    # Validasi status proyek, tidak boleh mengedit jika sudah ada proposal yang di terima (IN_PROGRESS/DONE)
    if project.status != ProjectStatus.OPEN and project.status != ProjectStatus.BIDDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proyek dengan status '{project.status.value}' tidak dapat diubah")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == project.umkm_id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None
    total_pelamar = db.query(Proposal).filter(Proposal.project_id == project.id).count()

    return ProjectResponse(
        id=project.id,
        umkm_id=project.umkm_id,
        judul=project.judul,
        deskripsi_raw=project.deskripsi_raw,
        kategori=project.kategori,
        budget_max=project.budget_max,
        deadline=project.deadline,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        umkm_profile=umkm_summary,
        total_pelamar=total_pelamar
    )

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    id  : UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    # Mengahapus proyek (Hanya pemilik proyek yang dapat menghapus proyeknya sendiri & jika proyek belum ada proposal yang diterima)
    project = db.query(Project).filter(Project.id == id, Project.umkm_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan atau Anda tidak memiliki izin untuk menghapus proyek ini")

    # Bola guard
    if project.umkm_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk menghapus proyek ini")

    # Cegah pengahpusan proyek jika sudah berjalan atau sudah selesai (IN_PROGRESS/DONE)
    if project.status == ProjectStatus.IN_PROGRESS or project.status == ProjectStatus.DONE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Proyek dengan status '{project.status.value}' proyek sedang berjalan atau sudah selesai tidak dapat dihapus")

    db.delete(project)
    db.commit()
    return None


@router.post("/{id}/reopen", response_model=ProjectResponse)
def reopen_project(
    id: UUID,
    body: ProjectReopenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    """
    Klien UMKM membatalkan kontrak pengerjaan mahasiswa dan membuka kembali proyek ke katalog eksplorasi.
    1. Validasi kepemilikan dan status proyek (harus IN_PROGRESS).
    2. Kembalikan dana escrow mahasiswa yang diterima ke saldo aktif UMKM (REFUND).
    3. Ubah status proposal mahasiswa yang diterima menjadi WITHDRAWN.
    4. Ubah status proyek menjadi OPEN (dan perbarui deadline jika diberikan).
    5. Kirim notifikasi ke mahasiswa dan UMKM.
    """
    project = db.query(Project).filter(Project.id == id, Project.umkm_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan atau Anda tidak memiliki izin untuk mengelola proyek ini")

    if project.status != ProjectStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hanya proyek dengan status 'IN_PROGRESS' yang dapat dibuka kembali. Status proyek saat ini: {project.status.value}"
        )

    if body.new_deadline:
        project.deadline = body.new_deadline
    elif project.deadline <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenggat waktu proyek sebelumnya telah lewat. Harap tentukan tanggal tenggat baru di masa depan untuk membuka kembali proyek."
        )

    accepted_prop = (
        db.query(Proposal)
        .filter(Proposal.project_id == project.id, Proposal.status == ProposalStatus.ACCEPTED)
        .first()
    )

    nominal_refund = Decimal("0")
    if accepted_prop:
        nominal_refund = accepted_prop.harga_tawar

        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).with_for_update().first()
        if wallet and wallet.saldo_escrow >= nominal_refund:
            wallet.saldo_escrow -= nominal_refund
            wallet.saldo_aktif += nominal_refund

            ledger_entry = LedgerLog(
                wallet_id=wallet.id,
                project_id=project.id,
                tipe=TransactionType.REFUND,
                nominal=nominal_refund,
                keterangan=f"Pengembalian escrow proyek '{project.judul}' ke saldo aktif karena pembatalan kontrak dengan mahasiswa"
            )
            db.add(ledger_entry)

        accepted_prop.status = ProposalStatus.WITHDRAWN

        alasan_text = f" Alasan: {body.reason}" if body.reason else ""
        notif_mhs = Notification(
            user_id=accepted_prop.mhs_id,
            judul="Kontrak Proyek Dibatalkan oleh UMKM",
            pesan=f"Kontrak kerja sama Anda untuk proyek '{project.judul}' telah dibatalkan oleh klien UMKM.{alasan_text}",
            tipe=NotificationType.PROPOSAL,
            url_referensi="/proposals"
        )
        db.add(notif_mhs)

    project.status = ProjectStatus.OPEN

    pesan_umkm = f"Proyek '{project.judul}' berhasil dibuka kembali ke katalog eksplorasi."
    if nominal_refund > 0:
        pesan_umkm += f" Dana escrow sebesar Rp {int(nominal_refund):,} telah dikembalikan ke Saldo Aktif Anda."

    notif_umkm = Notification(
        user_id=current_user.id,
        judul="Proyek Berhasil Dibuka Kembali",
        pesan=pesan_umkm,
        tipe=NotificationType.PROPOSAL,
        url_referensi=f"/workroom/{project.id}"
    )
    db.add(notif_umkm)

    db.commit()
    db.refresh(project)

    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == project.umkm_id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None
    total_pelamar = db.query(Proposal).filter(Proposal.project_id == project.id).count()
    acc_nama, acc_foto = _resolve_accepted_mhs(project.id, db)

    return ProjectResponse(
        id=project.id,
        umkm_id=project.umkm_id,
        judul=project.judul,
        deskripsi_raw=project.deskripsi_raw,
        kategori=project.kategori,
        budget_max=project.budget_max,
        deadline=project.deadline,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        umkm_profile=umkm_summary,
        umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
        accepted_mhs_nama=acc_nama,
        accepted_mhs_foto=acc_foto,
        total_pelamar=total_pelamar
    )


@router.post("/{id}/terminate-and-cancel", response_model=ProjectResponse)
def terminate_and_cancel_project(
    id: UUID,
    body: ProjectTerminateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM))
):
    """
    Klien UMKM membatalkan proyek secara permanen (CANCELLED) saat IN_PROGRESS:
    1. Validasi kepemilikan dan status proyek (harus IN_PROGRESS).
    2. Kembalikan dana escrow mahasiswa yang diterima ke saldo aktif UMKM (REFUND).
    3. Ubah status proposal mahasiswa yang diterima menjadi WITHDRAWN.
    4. Ubah status proyek menjadi CANCELLED.
    5. Kirim notifikasi ke mahasiswa dan UMKM.
    """
    project = db.query(Project).filter(Project.id == id, Project.umkm_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan atau Anda tidak memiliki izin untuk mengelola proyek ini")

    if project.status != ProjectStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hanya proyek dengan status 'IN_PROGRESS' yang dapat dibatalkan melalui fitur ini. Status proyek saat ini: {project.status.value}"
        )

    accepted_prop = (
        db.query(Proposal)
        .filter(Proposal.project_id == project.id, Proposal.status == ProposalStatus.ACCEPTED)
        .first()
    )

    nominal_refund = Decimal("0")
    if accepted_prop:
        nominal_refund = accepted_prop.harga_tawar

        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).with_for_update().first()
        if wallet and wallet.saldo_escrow >= nominal_refund:
            wallet.saldo_escrow -= nominal_refund
            wallet.saldo_aktif += nominal_refund

            ledger_entry = LedgerLog(
                wallet_id=wallet.id,
                project_id=project.id,
                tipe=TransactionType.REFUND,
                nominal=nominal_refund,
                keterangan=f"Pengembalian escrow proyek '{project.judul}' ke saldo aktif karena pembatalan total proyek oleh UMKM"
            )
            db.add(ledger_entry)

        accepted_prop.status = ProposalStatus.WITHDRAWN

        alasan_text = f" Alasan: {body.reason}" if body.reason else ""
        notif_mhs = Notification(
            user_id=accepted_prop.mhs_id,
            judul="Proyek Dibatalkan oleh UMKM",
            pesan=f"Proyek '{project.judul}' telah dibatalkan oleh klien UMKM.{alasan_text}",
            tipe=NotificationType.PROPOSAL,
            url_referensi="/proposals"
        )
        db.add(notif_mhs)

    project.status = ProjectStatus.CANCELLED

    pesan_umkm = f"Proyek '{project.judul}' telah berhasil dibatalkan secara permanen."
    if nominal_refund > 0:
        pesan_umkm += f" Seluruh dana escrow sebesar Rp {int(nominal_refund):,} telah dikembalikan ke Saldo Aktif Anda."

    notif_umkm = Notification(
        user_id=current_user.id,
        judul="Proyek Berhasil Dibatalkan",
        pesan=pesan_umkm,
        tipe=NotificationType.PROPOSAL,
        url_referensi=f"/projects/{project.id}"
    )
    db.add(notif_umkm)

    db.commit()
    db.refresh(project)

    profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == project.umkm_id).first()
    umkm_summary = UmkmSummary.model_validate(profile) if profile else None
    total_pelamar = db.query(Proposal).filter(Proposal.project_id == project.id).count()

    return ProjectResponse(
        id=project.id,
        umkm_id=project.umkm_id,
        judul=project.judul,
        deskripsi_raw=project.deskripsi_raw,
        kategori=project.kategori,
        budget_max=project.budget_max,
        deadline=project.deadline,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        umkm_profile=umkm_summary,
        umkm_nama=profile.nama_usaha if profile and profile.nama_usaha else None,
        accepted_mhs_nama=None,
        accepted_mhs_foto=None,
        total_pelamar=total_pelamar
    )