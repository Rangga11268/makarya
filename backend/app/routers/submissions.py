from datetime import datetime, timezone, timedelta
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.models.escrow import Escrow, EscrowStatus
from app.schemas.submission import SubmissionCreateRequest, RevisionRequest, SubmissionResponse
from app.routers.certificates import issue_certificate_for_proposal


router = APIRouter(prefix="/submissions", tags=["Submissions & Revision Control"])


def format_submission_response(submission: Submission) -> dict:
    proposal = submission.proposal
    mhs = proposal.mahasiswa if proposal else None
    profile = mhs.profile_mhs if mhs else None
    slot = proposal.slot if proposal else None

    submitter_name = (profile.nama_lengkap if profile and profile.nama_lengkap else (mhs.username if mhs else "Mahasiswa"))
    submitter_photo = profile.url_foto if profile else None
    submitter_prodi = profile.prodi.nama_prodi if (profile and profile.prodi) else "Informatika"

    submitter_kampus = "Universitas Terdaftar"
    if mhs and mhs.email:
        email_domain = mhs.email.split("@")[-1].lower()
        if "ubsi" in email_domain:
            submitter_kampus = "Universitas Bina Sarana Informatika (UBSI)"
        elif "ui.ac.id" in email_domain:
            submitter_kampus = "Universitas Indonesia (UI)"
        elif "itb.ac.id" in email_domain:
            submitter_kampus = "Institut Teknologi Bandung (ITB)"
        elif "ugm.ac.id" in email_domain:
            submitter_kampus = "Universitas Gadjah Mada (UGM)"
        else:
            submitter_kampus = f"Kampus @{email_domain}"

    role_name = slot.nama_peran if slot and slot.nama_peran else "Pelaksana Utama"

    return {
        "id": submission.id,
        "proposal_id": submission.proposal_id,
        "url_berkas": submission.url_berkas,
        "url_source_file": submission.url_source_file,
        "catatan_pengiriman": submission.catatan_pengiriman,
        "jumlah_revisi": submission.jumlah_revisi,
        "status": submission.status,
        "submitted_at": submission.submitted_at,
        "updated_at": submission.updated_at,
        "submitter_name": submitter_name,
        "submitter_photo": submitter_photo,
        "submitter_kampus": submitter_kampus,
        "submitter_prodi": submitter_prodi,
        "role_name": role_name,
    }


@router.post("", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_work(
    body: SubmissionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.MHS)),
):
    """Mahasiswa Mengirimkan Hasil Pekerjaan Proyek"""
    project = db.query(Project).filter(Project.id == body.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    if project.status != ProjectStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Hasil kerja hanya dapat dikirimkan saat Proyek dalam status 'IN_PROGRESS' (status saat ini: '{project.status.value}')",
        )

    # Validasi pastikan mahasiswa ini adalah pekerja yang proposalnya disetujui
    accepted_proposal = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project.id,
            Proposal.mhs_id == current_user.id,
            Proposal.status.in_([ProposalStatus.ACCEPTED, ProposalStatus.COMPLETED]),
        )
        .first()
    )
    if not accepted_proposal:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki proposal yang disetujui untuk proyek ini. Hanya mahasiswa dengan proposal yang disetujui yang dapat mengirimkan hasil kerja.",
        )

    # Cek apakah sudah ada submission sebelumnya untuk proposal ini
    submission = db.query(Submission).filter(Submission.proposal_id == accepted_proposal.id).first()

    if submission:
        # Update submission jika sudah ada
        submission.url_berkas = body.url_berkas
        submission.catatan_pengiriman = body.catatan_pengiriman
        submission.status = SubmissionStatus.SUBMITTED
    else:
        # Buat submission baru
        submission = Submission(
            proposal_id=accepted_proposal.id,
            url_berkas=body.url_berkas,
            catatan_pengiriman=body.catatan_pengiriman,
            jumlah_revisi=0,
            status=SubmissionStatus.SUBMITTED,
        )
        db.add(submission)

    # Sinkronisasi status Escrow ke SUBMITTED & set timer auto-approval 7 hari
    escrow = db.query(Escrow).filter(Escrow.proposal_id == accepted_proposal.id).first()
    if escrow:
        escrow.status = EscrowStatus.SUBMITTED
        escrow.auto_approve_at = datetime.now(timezone.utc) + timedelta(days=7)

    db.commit()
    db.refresh(submission)
    return format_submission_response(submission)


@router.get("/project/{project_id}", response_model=SubmissionResponse)
def get_submission_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Hasil Kerja Proyek Berdasarkan ID Proyek (Bisa diakses UMKM dan seluruh anggota tim)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    # Cari semua proposal yang disetujui / selesai pada proyek ini
    accepted_proposals = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project_id,
            Proposal.status.in_([ProposalStatus.ACCEPTED, ProposalStatus.COMPLETED]),
        )
        .all()
    )
    if not accepted_proposals:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Belum ada proposal yang disetujui untuk proyek ini",
        )

    # BOLA guard: Pemilik proyek UMKM, Admin, ATAU Mahasiswa anggota tim yang proposalnya disetujui
    accepted_mhs_ids = [p.mhs_id for p in accepted_proposals]
    is_authorized = (
        project.umkm_id == current_user.id
        or current_user.id in accepted_mhs_ids
        or current_user.role == UserRole.ADMIN
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk melihat hasil kerja proyek ini",
        )

    # Jika pemanggil adalah mahasiswa anggota tim, cari submisi miliknya terlebih dahulu
    submission = None
    if current_user.role == UserRole.MHS:
        my_prop = next((p for p in accepted_proposals if p.mhs_id == current_user.id), None)
        if my_prop:
            submission = db.query(Submission).filter(Submission.proposal_id == my_prop.id).first()

    # Jika tidak ada submisi milik sendiri atau pemanggil adalah UMKM, cari submisi terkini dari proyek
    if not submission:
        accepted_proposal_ids = [p.id for p in accepted_proposals]
        submission = (
            db.query(Submission)
            .filter(Submission.proposal_id.in_(accepted_proposal_ids))
            .order_by(Submission.submitted_at.desc())
            .first()
        )

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hasil kerja belum dikirimkan untuk proyek ini",
        )

    return format_submission_response(submission)


@router.get("/project/{project_id}/all", response_model=List[SubmissionResponse])
def get_all_submissions_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Semua Submisi Hasil Kerja Proyek (Untuk UMKM dan Anggota Tim)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    accepted_proposals = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project_id,
            Proposal.status.in_([ProposalStatus.ACCEPTED, ProposalStatus.COMPLETED]),
        )
        .all()
    )
    if not accepted_proposals:
        return []

    accepted_mhs_ids = [p.mhs_id for p in accepted_proposals]
    is_authorized = (
        project.umkm_id == current_user.id
        or current_user.id in accepted_mhs_ids
        or current_user.role == UserRole.ADMIN
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk melihat hasil kerja proyek ini",
        )

    accepted_proposal_ids = [p.id for p in accepted_proposals]
    submissions = (
        db.query(Submission)
        .filter(Submission.proposal_id.in_(accepted_proposal_ids))
        .order_by(Submission.submitted_at.desc())
        .all()
    )

    return [format_submission_response(s) for s in submissions]


@router.patch("/{id}/approve", response_model=SubmissionResponse)
def approve_submission(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM)),
):
    """
    UMKM Menyetujui Hasil Kerja & Mencairkan Dana Escrow:
    1. Validasi pemilik proyek.
    2. Kurangi saldo_escrow UMKM.
    3. Tambah saldo_aktif Mahasiswa pekerja.
    4. Catat transaksi di ledger_logs (RELEASE).
    5. Ubah status proyek -> DONE dan status submission -> ACCEPTED.
    """
    submission = db.query(Submission).filter(Submission.id == id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hasil kerja tidak ditemukan")

    accepted_proposal = submission.proposal
    project = accepted_proposal.project

    if project.umkm_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk menyetujui hasil kerja ini",
        )

    if submission.status == SubmissionStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hasil kerja sudah disetujui sebelumnya",
        )

    honor_amount = accepted_proposal.harga_tawar

    # Kunci dompet UMKM dan Mahasiswa dengan pessimistic lock (anti race condition)
    umkm_wallet = db.query(Wallet).filter(Wallet.user_id == project.umkm_id).with_for_update().first()
    mhs_wallet = db.query(Wallet).filter(Wallet.user_id == accepted_proposal.mhs_id).with_for_update().first()

    # Guard: Inisialisasi otomatis jika dompet belum pernah dibuat
    if not umkm_wallet:
        umkm_wallet = Wallet(user_id=project.umkm_id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(umkm_wallet)
        db.flush()

    if not mhs_wallet:
        mhs_wallet = Wallet(user_id=accepted_proposal.mhs_id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(mhs_wallet)
        db.flush()

    if umkm_wallet.saldo_escrow < honor_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo escrow UMKM ({umkm_wallet.saldo_escrow}) tidak mencukupi untuk mencairkan honor ({honor_amount})",
        )

    # Pindahkan escrow dari UMKM ke saldo aktif Mahasiswa
    umkm_wallet.saldo_escrow -= honor_amount
    mhs_wallet.saldo_aktif += honor_amount

    # Catat audit trail transaksi di ledger_logs
    log_umkm = LedgerLog(
        wallet_id=umkm_wallet.id,
        project_id=project.id,
        tipe=TransactionType.RELEASE,
        nominal=honor_amount,
        keterangan=f"Pencairan dana escrow untuk proyek '{project.judul}' kepada mahasiswa",
    )
    log_mhs = LedgerLog(
        wallet_id=mhs_wallet.id,
        project_id=project.id,
        tipe=TransactionType.RELEASE,
        nominal=honor_amount,
        keterangan=f"Penerimaan honor dari proyek '{project.judul}'",
    )
    db.add(log_umkm)
    db.add(log_mhs)

    # Update status submission, proposal, dan slot
    submission.status = SubmissionStatus.APPROVED
    accepted_proposal.status = ProposalStatus.COMPLETED

    if accepted_proposal.slot:
        accepted_proposal.slot.status = "COMPLETED"

    # Cek apakah seluruh proposal yang diterima di proyek ini sudah selesai/disetujui
    all_accepted_proposals = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project.id,
            Proposal.status.in_([ProposalStatus.ACCEPTED, ProposalStatus.COMPLETED]),
        )
        .all()
    )

    all_proposals_approved = True
    for p in all_accepted_proposals:
        p_sub = db.query(Submission).filter(Submission.proposal_id == p.id).first()
        if not p_sub or p_sub.status != SubmissionStatus.APPROVED:
            all_proposals_approved = False
            break

    if all_proposals_approved:
        project.status = ProjectStatus.DONE
    else:
        project.status = ProjectStatus.IN_PROGRESS

    # Sinkronisasi status Escrow ke RELEASED
    escrow = db.query(Escrow).filter(Escrow.proposal_id == accepted_proposal.id).first()
    if escrow:
        escrow.status = EscrowStatus.RELEASED
        escrow.released_at = func.now()
        escrow.auto_approve_at = None

    # Terbitkan Sertifikat Digital & Portfolio Otomatis
    try:
        issue_certificate_for_proposal(db, accepted_proposal, submission)
    except Exception as e:
        # Jangan gagalkan approval jika penerbitan cert menemui kendala minor
        pass

    db.commit()
    db.refresh(submission)
    return format_submission_response(submission)


@router.patch("/{id}/request-revision", response_model=SubmissionResponse)
def request_revision(
    id: UUID,
    body: RevisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.UMKM)),
):
    """
    UMKM Meminta Revisi Hasil Kerja (Maksimal 2 Kali).
    Jika sudah 2 kali revisi, UMKM wajib Approve atau ajukan Dispute.
    """
    submission = db.query(Submission).filter(Submission.id == id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hasil kerja tidak ditemukan")

    accepted_proposal = submission.proposal
    project = accepted_proposal.project

    if project.umkm_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk meminta revisi hasil kerja ini",
        )

    if submission.status == SubmissionStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hasil kerja sudah diterima, tidak dapat meminta revisi",
        )

    # Pengecekan batas maksimal revisi (Maksimal 2 kali untuk melindungi mahasiswa)
    if submission.jumlah_revisi >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batas maksimal revisi telah tercapai (Maks 2x). UMKM wajib Approve atau ajukan Dispute mediasi admin.",
        )

    checklist_text = ""
    if body.checklist_items:
        clean_items = [it.strip() for it in body.checklist_items if it.strip()]
        if clean_items:
            checklist_text = "\n\nDaftar Poin Perbaikan:\n" + "\n".join(f"- [ ] {it}" for it in clean_items)

    # Tambah counter revisi & perbarui status
    submission.jumlah_revisi += 1
    submission.status = SubmissionStatus.REVISION_REQUESTED
    submission.catatan_pengiriman = f"[Revisi #{submission.jumlah_revisi}] {body.alasan_revisi}{checklist_text}"

    # Sinkronisasi status Escrow ke REVISION dan pause timer auto-approval
    escrow = db.query(Escrow).filter(Escrow.proposal_id == accepted_proposal.id).first()
    if escrow:
        escrow.status = EscrowStatus.REVISION
        escrow.auto_approve_at = None

    db.commit()
    db.refresh(submission)
    return format_submission_response(submission)
