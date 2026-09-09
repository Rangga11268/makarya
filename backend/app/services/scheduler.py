import logging
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
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
    # Kasus 2: Pengingat H-1 untuk Proyek IN_PROGRESS
    # Kasus 2: Pengingat H-1 & Peringatan Overdue untuk Proyek IN_PROGRESS
    # ---------------------------------------------------------
    # Karena kita menyimpan 'estimasi_hari' pada proposal, kita asumsikan 
    # deadline pengerjaan = tanggal_diterima (updated_at) + estimasi_hari
    
    # Tentukan batas waktu pengerjaan berdasarkan estimasi selesai atau deadline proyek
    in_progress_proposals = db.query(Proposal).filter(
        Proposal.status == ProposalStatus.ACCEPTED,
        Proposal.project.has(status=ProjectStatus.IN_PROGRESS)
    ).all()

    today_start = datetime.combine(today, datetime.min.time())

    for prop in in_progress_proposals:
        # Asumsikan updated_at adalah waktu diterima
        tanggal_mulai = prop.updated_at.date()
        # Hitung estimasi selesai
        tanggal_mulai = prop.updated_at.date() if prop.updated_at else today
        estimasi_selesai = tanggal_mulai + timedelta(days=prop.estimasi_hari)
        
        if estimasi_selesai == tomorrow:
            # Pengingat H-1 Mahasiswa
            notif_mhs_reminder = Notification(
                user_id=prop.mhs_id,
                judul="Pengingat Tenggat Proyek (H-1)",
                pesan=f"Harap segera kumpul hasil kerja untuk proyek '{prop.project.judul}'. Tenggat waktu besok!",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/proposals/{prop.id}"
            )
            db.add(notif_mhs_reminder)
        # Batas efektif adalah deadline proyek jika ditentukan dan lebih awal, atau estimasi proposal
        effective_deadline = estimasi_selesai
        if prop.project.deadline and prop.project.deadline < effective_deadline:
            effective_deadline = prop.project.deadline

            # Pengingat H-1 UMKM
            notif_umkm_reminder = Notification(
                user_id=prop.project.umkm_id,
                judul="Pengingat Pengerjaan Proyek (H-1)",
                pesan=f"Proyek '{prop.project.judul}' yang dikerjakan mahasiswa akan jatuh tempo besok. Harap cek ruang kerja Anda.",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/projects/{prop.project.id}"
            )
            db.add(notif_umkm_reminder)
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
            
        elif estimasi_selesai < today:
            # Lewat deadline namun masih IN_PROGRESS
            notif_mhs_late = Notification(
                user_id=prop.mhs_id,
                judul="Peringatan Keterlambatan Proyek",
                pesan=f"Anda telah melewati batas waktu pengerjaan proyek '{prop.project.judul}'. Harap segera unggah deliverable atau UMKM berhak mengajukan sengketa.",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/proposals/{prop.id}"
            )
            db.add(notif_mhs_late)
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
