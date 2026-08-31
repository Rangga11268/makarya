from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.schemas.submission import SubmissionCreateRequest, RevisionRequest, SubmissionResponse

router = APIRouter(prefix="/submissions", tags=["Submissions & Revision Control"])


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
            Proposal.status == ProposalStatus.ACCEPTED,
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

    db.commit()
    db.refresh(submission)
    return submission


@router.get("/project/{project_id}", response_model=SubmissionResponse)
def get_submission_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Melihat Hasil Kerja Proyek Berdasarkan ID Proyek"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

    # Cari proposal yang disetujui pada proyek ini
    accepted_proposal = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project_id,
            Proposal.status == ProposalStatus.ACCEPTED,
        )
        .first()
    )
    if not accepted_proposal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Belum ada proposal yang disetujui untuk proyek ini",
        )

    submission = db.query(Submission).filter(Submission.proposal_id == accepted_proposal.id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hasil kerja belum dikirimkan untuk proyek ini",
        )

    # BOLA guard : Hanya pemilik proyek UMKM, mahasiswa pekerja, atau admin yang berhak melihat
    if (
        project.umkm_id != current_user.id
        and accepted_proposal.mhs_id != current_user.id
        and current_user.role != UserRole.ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak memiliki izin untuk melihat hasil kerja proyek ini",
        )

    return submission


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

    # Update status proyek dan submission
    submission.status = SubmissionStatus.APPROVED
    project.status = ProjectStatus.DONE

    db.commit()
    db.refresh(submission)
    return submission


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

    # Tambah counter revisi & perbarui status
    submission.jumlah_revisi += 1
    submission.status = SubmissionStatus.REVISION_REQUESTED
    submission.catatan_pengiriman = f"[Revisi #{submission.jumlah_revisi}] {body.alasan_revisi}"

    db.commit()
    db.refresh(submission)
    return submission