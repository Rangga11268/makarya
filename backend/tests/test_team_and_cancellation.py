import pytest
from decimal import Decimal
from datetime import date, timedelta
from app.models.project import Project, ProjectStatus, ProjectCategory, ProjectSlot
from app.core.database import SessionLocal

def test_team_project_and_slots_creation():
    db = SessionLocal()
    try:
        from app.models.user import User, UserRole
        umkm = db.query(User).filter(User.role == UserRole.UMKM).first()
        if not umkm:
            pytest.skip('No UMKM user found in test DB')

        future_date = date.today() + timedelta(days=14)
        proj = Project(
            umkm_id=umkm.id,
            judul='Test Proyek Tim Rebranding & Web',
            deskripsi_raw='Kebutuhan kolaborasi tim untuk desainer dan web developer secara terstruktur',
            kategori=ProjectCategory.PEMROGRAMAN,
            budget_max=Decimal('1500000'),
            deadline=future_date,
            status=ProjectStatus.OPEN,
            tipe_kolaborasi='TIM',
            cancel_reason='Contoh alasan pembatalan jika ada',
            cancelled_by_role='UMKM'
        )
        db.add(proj)
        db.flush()

        slot1 = ProjectSlot(
            project_id=proj.id,
            nama_peran='UI/UX Designer',
            deskripsi_tugas='Membuat mockup Figma',
            alokasi_budget=Decimal('600000'),
            status='OPEN'
        )
        slot2 = ProjectSlot(
            project_id=proj.id,
            nama_peran='Frontend Developer',
            deskripsi_tugas='Mengimplementasikan web React',
            alokasi_budget=Decimal('900000'),
            status='OPEN'
        )
        db.add_all([slot1, slot2])
        db.commit()
        db.refresh(proj)

        assert proj.tipe_kolaborasi == 'TIM'
        assert len(proj.slots) == 2
        assert proj.cancel_reason == 'Contoh alasan pembatalan jika ada'
        assert proj.cancelled_by_role == 'UMKM'

        db.delete(proj)
        db.commit()
    finally:
        db.close()


def test_team_project_browse_with_partial_slots(client):
    db = SessionLocal()
    try:
        from app.models.user import User, UserRole
        umkm = db.query(User).filter(User.role == UserRole.UMKM).first()
        if not umkm:
            pytest.skip('No UMKM user found in test DB')

        future_date = date.today() + timedelta(days=10)
        proj = Project(
            umkm_id=umkm.id,
            judul='Test Proyek Tim Partial Slot Browse',
            deskripsi_raw='Proyek dengan 2 slot di mana 1 slot diambil',
            kategori=ProjectCategory.PEMROGRAMAN,
            budget_max=Decimal('1000000'),
            deadline=future_date,
            status=ProjectStatus.OPEN,
            tipe_kolaborasi='TIM'
        )
        db.add(proj)
        db.flush()

        slot1 = ProjectSlot(
            project_id=proj.id,
            nama_peran='Role A',
            deskripsi_tugas='Task A',
            alokasi_budget=Decimal('500000'),
            status='IN_PROGRESS'  # 1 slot filled
        )
        slot2 = ProjectSlot(
            project_id=proj.id,
            nama_peran='Role B',
            deskripsi_tugas='Task B',
            alokasi_budget=Decimal('500000'),
            status='OPEN'  # 1 slot still open
        )
        db.add_all([slot1, slot2])
        db.commit()

        # Harus tetap muncul dalam browse_project dengan status OPEN
        res = client.get("/v1/projects?status=OPEN&limit=50")
        assert res.status_code == 200
        data = res.json()
        found_ids = [p["id"] for p in data]
        assert str(proj.id) in found_ids

        db.delete(proj)
        db.commit()
    finally:
        db.close()

