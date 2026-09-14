import logging
from datetime import datetime, timedelta, date, timezone
from sqlalchemy.orm import Session
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.submission import Submission, SubmissionStatus
from app.models.escrow import Escrow, EscrowStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.models.notification import Notification, NotificationType


logger = logging.getLogger(__name__)

def run_project_deadline_check(db: Session):
    """
    Fungsi Scheduler Harian untuk menangani:
    1. Proyek OPEN/BIDDING yang melewati deadline (jadi CANCELLED).
    2. Proyek IN_PROGRESS yang tenggat waktunya habis / segera habis (Pengingat H-1).
    """
    today = date.today()
    tomorrow = today + timedelta(days=1)

    # ---------------------------------------------------------
    # Kasus 1: Proyek OPEN / BIDDING yang Expired tanpa penerimaan
    # ---------------------------------------------------------
    expired_projects = db.query(Project).filter(
        Project.status.in_([ProjectStatus.OPEN, ProjectStatus.BIDDING]),
        Project.deadline < today
    ).all()

    for proj in expired_projects:
        proj.status = ProjectStatus.CANCELLED
        
        # Tolak otomatis semua proposal yang masuk
        for prop in proj.proposals:
            if prop.status == ProposalStatus.PENDING:
                prop.status = ProposalStatus.REJECTED
                
                # Kirim Notifikasi ke Mahasiswa
                notif_mhs = Notification(
                    user_id=prop.mhs_id,
                    judul="Proyek Dibatalkan",
                    pesan=f"Proposal Anda pada proyek '{proj.judul}' ditolak otomatis karena proyek telah kedaluwarsa.",
                    tipe=NotificationType.SYSTEM
                )
                db.add(notif_mhs)

        # Kirim Notifikasi ke Klien UMKM
        notif_umkm = Notification(
            user_id=proj.umkm_id,
            judul="Waktu Proyek Habis",
            pesan=f"Proyek '{proj.judul}' Anda telah kedaluwarsa tanpa ada pelamar yang disetujui, dan kini dibatalkan otomatis.",
            tipe=NotificationType.SYSTEM
        )
        db.add(notif_umkm)
        
    # ---------------------------------------------------------
    # Kasus 2: Pengingat H-1 & Peringatan Overdue untuk Proyek IN_PROGRESS
    # ---------------------------------------------------------
    # Tentukan batas waktu pengerjaan berdasarkan estimasi selesai atau deadline proyek
    in_progress_proposals = db.query(Proposal).filter(
        Proposal.status == ProposalStatus.ACCEPTED,
        Proposal.project.has(status=ProjectStatus.IN_PROGRESS)
    ).all()

    today_start = datetime.combine(today, datetime.min.time())

    for prop in in_progress_proposals:
        # Hitung estimasi selesai
        tanggal_mulai = prop.updated_at.date() if prop.updated_at else today
        estimasi_selesai = tanggal_mulai + timedelta(days=prop.estimasi_hari)
        
        # Batas efektif adalah deadline proyek jika ditentukan dan lebih awal, atau estimasi proposal
        effective_deadline = estimasi_selesai
        if prop.project.deadline and prop.project.deadline < effective_deadline:
            effective_deadline = prop.project.deadline

        if effective_deadline == tomorrow:
            # Cek apakah notifikasi H-1 sudah pernah dikirim hari ini
            already_notified = db.query(Notification).filter(
                Notification.user_id == prop.mhs_id,
                Notification.judul == "Pengingat Tenggat Proyek (H-1)",
                Notification.created_at >= today_start
            ).first()

            if not already_notified:
                # Pengingat H-1 Mahasiswa
                notif_mhs_reminder = Notification(
                    user_id=prop.mhs_id,
                    judul="Pengingat Tenggat Proyek (H-1)",
                    pesan=f"Harap segera kumpul hasil kerja untuk proyek '{prop.project.judul}'. Tenggat waktu pengerjaan besok!",
                    tipe=NotificationType.SYSTEM,
                    url_referensi=f"/proposals/{prop.id}"
                )
                db.add(notif_mhs_reminder)

                # Pengingat H-1 UMKM
                notif_umkm_reminder = Notification(
                    user_id=prop.project.umkm_id,
                    judul="Pengingat Pengerjaan Proyek (H-1)",
                    pesan=f"Proyek '{prop.project.judul}' yang dikerjakan mahasiswa akan jatuh tempo besok. Harap cek ruang kerja Anda.",
                    tipe=NotificationType.SYSTEM,
                    url_referensi=f"/projects/{prop.project.id}"
                )
                db.add(notif_umkm_reminder)
            
        elif effective_deadline < today:
            # Cek apakah notifikasi keterlambatan sudah pernah dikirim hari ini
            already_notified_mhs = db.query(Notification).filter(
                Notification.user_id == prop.mhs_id,
                Notification.judul == "Peringatan Keterlambatan Proyek",
                Notification.created_at >= today_start
            ).first()

            if not already_notified_mhs:
                # Peringatan Mahasiswa
                notif_mhs_late = Notification(
                    user_id=prop.mhs_id,
                    judul="Peringatan Keterlambatan Proyek",
                    pesan=f"Pengerjaan proyek '{prop.project.judul}' telah melewati batas tenggat waktu. Harap segera unggah deliverable untuk menghindari pembatalan atau pengajuan sengketa oleh klien UMKM.",
                    tipe=NotificationType.SYSTEM,
                    url_referensi=f"/proposals/{prop.id}"
                )
                db.add(notif_mhs_late)

            # Cek dan kirim notifikasi ke UMKM jika belum hari ini
            already_notified_umkm = db.query(Notification).filter(
                Notification.user_id == prop.project.umkm_id,
                Notification.judul == "Pengerjaan Proyek Melewati Tenggat",
                Notification.created_at >= today_start
            ).first()

            if not already_notified_umkm:
                notif_umkm_late = Notification(
                    user_id=prop.project.umkm_id,
                    judul="Pengerjaan Proyek Melewati Tenggat",
                    pesan=f"Pengerjaan proyek '{prop.project.judul}' oleh mahasiswa telah melewati estimasi tenggat waktu. Anda dapat memantau ruang diskusi atau mengajukan mediasi/sengketa jika diperlukan.",
                    tipe=NotificationType.SYSTEM,
                    url_referensi=f"/projects/{prop.project.id}"
                )
                db.add(notif_umkm_late)


    try:
        db.commit()
        if expired_projects:
            logger.info(f"Cronjob berhasil membatalkan {len(expired_projects)} proyek kadaluwarsa.")
        return len(expired_projects)
    except Exception as e:
        db.rollback()
        logger.error(f"Gagal mengeksekusi cronjob deadline: {str(e)}")
        return 0


def run_escrow_auto_approval(db: Session):
    """
    Cronjob Auto-Approval Escrow:
    Mencari transaksi escrow yang berstatus SUBMITTED dan sudah melewati batas auto_approve_at (default 7 hari).
    Jika UMKM tidak melakukan tindakan dalam 7 hari:
    1. Sistem secara otomatis menyetujui hasil kerja.
    2. Proyek dialihkan ke DONE.
    3. Dana dicairkan ke mahasiswa (RELEASED).
    4. Catat transaksi di LedgerLog.
    5. Kirim notifikasi sistem ke kedua belah pihak.
    """
    now = datetime.now(timezone.utc)
    due_escrows = db.query(Escrow).filter(
        Escrow.status == EscrowStatus.SUBMITTED,
        Escrow.auto_approve_at.isnot(None),
        Escrow.auto_approve_at <= now
    ).all()

    processed_count = 0
    for escrow in due_escrows:
        try:
            project = db.query(Project).filter(Project.id == escrow.project_id).first()
            proposal = db.query(Proposal).filter(Proposal.id == escrow.proposal_id).first()
            if not project or not proposal:
                continue

            # Kunci dompet kedua belah pihak
            umkm_wallet = db.query(Wallet).filter(Wallet.user_id == escrow.client_id).with_for_update().first()
            mhs_wallet = db.query(Wallet).filter(Wallet.user_id == escrow.talent_id).with_for_update().first()

            if not umkm_wallet or not mhs_wallet:
                continue

            if umkm_wallet.saldo_escrow < escrow.amount_total:
                logger.warning(f"Saldo escrow UMKM ({umkm_wallet.saldo_escrow}) kurang dari {escrow.amount_total} untuk escrow {escrow.id}")
                continue

            # Mutasi saldo
            umkm_wallet.saldo_escrow -= escrow.amount_total
            mhs_wallet.saldo_aktif += escrow.amount_talent

            # Catat Ledger
            log_umkm = LedgerLog(
                wallet_id=umkm_wallet.id,
                project_id=project.id,
                tipe=TransactionType.RELEASE,
                nominal=escrow.amount_total,
                keterangan=f"Pencairan otomatis (7 hari review berakhir) dana escrow untuk proyek '{project.judul}'",
            )
            log_mhs = LedgerLog(
                wallet_id=mhs_wallet.id,
                project_id=project.id,
                tipe=TransactionType.RELEASE,
                nominal=escrow.amount_talent,
                keterangan=f"Penerimaan honor otomatis (7 hari review berakhir) dari proyek '{project.judul}'",
            )
            db.add(log_umkm)
            db.add(log_mhs)

            # Update Submission jika ada
            submission = db.query(Submission).filter(Submission.proposal_id == proposal.id).first()
            if submission:
                submission.status = SubmissionStatus.APPROVED

            # Update Project & Escrow
            project.status = ProjectStatus.DONE
            escrow.status = EscrowStatus.RELEASED
            escrow.released_at = now
            escrow.auto_approve_at = None

            # Notifikasi ke UMKM
            notif_umkm = Notification(
                user_id=escrow.client_id,
                judul="Hasil Kerja Disetujui Otomatis",
                pesan=f"Hasil kerja proyek '{project.judul}' disetujui otomatis oleh sistem karena batas review 7 hari telah selesai. Dana escrow sebesar Rp {int(escrow.amount_total):,} telah dicairkan ke mahasiswa.",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/workroom/{project.id}"
            )
            db.add(notif_umkm)

            # Notifikasi ke Mahasiswa
            notif_mhs = Notification(
                user_id=escrow.talent_id,
                judul="Honor Proyek Dicairkan Otomatis",
                pesan=f"Selamat! Hasil kerja proyek '{project.judul}' disetujui otomatis oleh sistem (7 hari auto-approval). Honor sebesar Rp {int(escrow.amount_talent):,} telah masuk ke saldo aktif Anda.",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/proposals/{proposal.id}"
            )
            db.add(notif_mhs)

            processed_count += 1
        except Exception as err:
            logger.error(f"Error memproses auto-approve untuk escrow {escrow.id}: {err}")

    try:
        db.commit()
        if processed_count > 0:
            logger.info(f"Cronjob berhasil mengeksekusi auto-approval untuk {processed_count} transaksi escrow.")
        return processed_count
    except Exception as e:
        db.rollback()
        logger.error(f"Gagal commit auto-approval escrow: {str(e)}")
        return 0

