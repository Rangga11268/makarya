from typing import List
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.rating import Rating
from app.models.profile import ProfileMhs
from app.schemas.rating import RatingCreateRequest, RatingResponse

router = APIRouter(prefix="/ratings", tags=["Ratings & Reviews"])

@router.post("", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def give_rating(body: RatingCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Memberikan Rating & Ulasan (Skor 1 - 5 Bintang).
    Hanya dapat dilakukan jika status proyek sudah DONE.
    """

    # Cek keberadaan proyek
    project = db.query(Project).filter(Project.id == body.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan") 

    # Validasi status proyek
    if project.status != ProjectStatus.DONE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating hanya dapat diberikan untuk proyek yang sudah selesai (DONE)")

    # Cari proposal yang di setujui untuk mengetahui siapa mahasiswa yang mengerjakan proyek
    accepted_proposal = db.query(Proposal).filter(
        Proposal.project_id == body.project_id,
        Proposal.status == ProposalStatus.ACCEPTED
    ).first()
    if not accepted_proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal yang disetujui untuk proyek ini tidak ditemukan")

    # Validasi pihak yang terlibat hanya UMKM pemilik atau mahasiswa pekerja yang boleh memberikan rating
    is_umkm = project.umkm_id == current_user.id
    is_mhs = accepted_proposal.mhs_id == current_user.id
    if not is_umkm and not is_mhs:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki izin untuk memberikan rating pada proyek ini")  

    # Pastikan penerima rating adalah pihak lawan yang benar
    expected_recipient_id = accepted_proposal.mhs_id if is_umkm else project.umkm_id
    if body.ke_user_id != expected_recipient_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Penerima rating tidak sesuai dengan pihak yang terlibat dalam proyek ini")

    # Cegah pemberian rating ganda oleh pihak yang sama untuk proyek yang sama
    existing_rating = db.query(Rating).filter(
        Rating.project_id == body.project_id,
        Rating.dari_user_id == current_user.id
    ).first()
    if existing_rating:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Anda sudah memberikan rating untuk proyek ini")

    # Buat rating baru
    new_rating = Rating(
        project_id=body.project_id,
        dari_user_id=current_user.id,
        ke_user_id=body.ke_user_id,
        skor=body.skor,
        ulasan=body.ulasan
    )
    db.add(new_rating)

    # Auto update reputasi (rating_avg) profil mahasiswa jika penerima adalah mahasiswa
    mhs_profile = db.query(ProfileMhs).filter(ProfileMhs.user_id == body.ke_user_id).first()
    if mhs_profile:
        avg_score = (db.query(func.avg(Rating.skor)).filter(Rating.ke_user_id == body.ke_user_id).scalar())
        mhs_profile.rating_avg = Decimal(str(round(avg_score, 2))) if avg_score else Decimal(str(body.skor))
        mhs_profile.total_proyek_selesai += 1
    

    db.commit() 
    db.refresh(new_rating)
    return new_rating

@router.get("/user/{user_id}", response_model=List[RatingResponse])
def get_user_ratings(user_id: UUID, db: Session = Depends(get_db)):
    """Melihat Seluruh Ulasan yang Diterima oleh Suatu Pengguna"""
    ratings = db.query(Rating).filter(Rating.ke_user_id == user_id).all()
    return ratings

@router.get("/project/{project_id}", response_model=List[RatingResponse])
def get_project_ratings(project_id: UUID, db: Session = Depends(get_db)):
    """Melihat Seluruh Ulasan yang Diterima oleh Suatu Proyek"""
    ratings = db.query(Rating).filter(Rating.project_id == project_id).all()
    return ratings