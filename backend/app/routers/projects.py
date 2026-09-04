from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.project import Project, ProjectCategory, ProjectStatus
from app.models.profile import ProfileUmkm
from app.models.proposal import Proposal
from app.schemas.project import ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse, UmkmSummary


router = APIRouter(prefix="/projects", tags=["Projects"])


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
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if status:
        query = query.filter(Project.status == status)
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

    results = []
    for proj in projects:
        profile = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == proj.umkm_id).first()
        umkm_summary = UmkmSummary.model_validate(profile) if profile else None
        total_pelamar = db.query(Proposal).filter(Proposal.project_id == proj.id).count()

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
            total_pelamar=total_pelamar
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
            total_pelamar=total_pelamar
        ))
    return results

@router.get("/{id}", response_model=ProjectResponse)
def get_project_by_id(
    # Melihat detail proyek berdasarkan ID
    id: UUID,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan")

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