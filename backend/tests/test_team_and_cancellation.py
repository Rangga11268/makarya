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
