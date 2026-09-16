import pytest
from decimal import Decimal
from datetime import date, timedelta
from app.models.project import Project, ProjectStatus, ProjectCategory, ProjectSlot, ProjectMilestone
from app.models.user import User, UserRole
from app.core.database import SessionLocal
import json

def test_project_milestones_model_and_sync():
    db = SessionLocal()
    try:
        umkm = db.query(User).filter(User.role == UserRole.UMKM).first()
        mhs = db.query(User).filter(User.role == UserRole.MHS).first()
        if not umkm or not mhs:
            pytest.skip('No UMKM or Mahasiswa user found in test DB')

        proj = Project(
            umkm_id=umkm.id,
            judul='Test Proyek Milestone Sync',
            deskripsi_raw='Testing milestone progress sync across team members',
            kategori=ProjectCategory.PEMROGRAMAN,
            budget_max=Decimal('1000000'),
            deadline=date.today() + timedelta(days=10),
            status=ProjectStatus.IN_PROGRESS,
            tipe_kolaborasi='TIM'
        )
        db.add(proj)
        db.flush()

        # Add milestone record
        milestone = ProjectMilestone(
            project_id=proj.id,
            role_name='UI/UX Designer',
            completed_indices=json.dumps([0, 1]),
            updated_by_id=mhs.id
        )
        db.add(milestone)
        db.commit()
        db.refresh(proj)

        milestone_fetched = db.query(ProjectMilestone).filter(
            ProjectMilestone.project_id == proj.id,
            ProjectMilestone.role_name == 'UI/UX Designer'
        ).first()

        assert milestone_fetched is not None
        assert json.loads(milestone_fetched.completed_indices) == [0, 1]
        assert milestone_fetched.updated_by_id == mhs.id

        # Clean up
        db.delete(proj)
        db.commit()
    finally:
        db.close()
