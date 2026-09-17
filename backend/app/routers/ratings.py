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
from app.models.submission import Submission, SubmissionStatus
from app.models.rating import Rating
from app.models.profile import ProfileMhs, ProfileUmkm
from app.schemas.rating import RatingCreateRequest, RatingResponse

router = APIRouter(prefix="/ratings", tags=["Ratings & Reviews"])


@router.post("", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def give_rating(
    body: RatingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Memberikan Rating & Ulasan (Skor 1 - 5 Bintang).
    Dapat dilakukan jika status proyek sudah DONE atau hasil kerja mahasiswa target sudah APPROVED.
    """
    # 1. Cek keberadaan proyek
    project = db.query(Project).filter(Project.id == body.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proyek tidak ditemukan"
        )

    # 2. Validasi peran dan keterlibatan pengguna
    is_umkm = project.umkm_id == current_user.id

    # Ambil proposal yang relevan
    target_submission = None
    target_proposal = None

    if is_umkm:
        # UMKM me-rating mahasiswa tertentu (mendukung proyek tim multi-slot)
        target_proposal = (
            db.query(Proposal)
            .filter(
                Proposal.project_id == body.project_id,
                Proposal.mhs_id == body.ke_user_id,
                Proposal.status == ProposalStatus.ACCEPTED,
            )
            .first()
        )
        if not target_proposal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mahasiswa ini tidak memiliki proposal yang disetujui pada proyek ini",
            )
        target_submission = (
            db.query(Submission)
            .filter(Submission.proposal_id == target_proposal.id)
            .first()
        )
    else:
        # Mahasiswa me-rating UMKM
        target_proposal = (
            db.query(Proposal)
            .filter(
                Proposal.project_id == body.project_id,
                Proposal.mhs_id == current_user.id,
                Proposal.status == ProposalStatus.ACCEPTED,
            )
            .first()
        )
        if not target_proposal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Anda tidak memiliki proposal yang disetujui untuk proyek ini",
            )
        if body.ke_user_id != project.umkm_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Penerima rating untuk mahasiswa harus pemilik proyek (UMKM)",
            )
        target_submission = (
            db.query(Submission)
            .filter(Submission.proposal_id == target_proposal.id)
            .first()
        )

    # 3. Validasi status: Proyek harus sudah DONE atau hasil kerja mahasiswa terkait sudah APPROVED
    is_submission_approved = (
        target_submission and target_submission.status == SubmissionStatus.APPROVED
    )
    if project.status != ProjectStatus.DONE and not is_submission_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating hanya dapat diberikan untuk proyek yang sudah selesai atau hasil kerja yang sudah disetujui (APPROVED)",
        )

    # 4. Cegah rating ganda oleh pemberi ke penerima yang sama pada proyek yang sama
    existing_rating = (
        db.query(Rating)
        .filter(
            Rating.project_id == body.project_id,
            Rating.dari_user_id == current_user.id,
            Rating.ke_user_id == body.ke_user_id,
        )
        .first()
    )
    if existing_rating:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Anda sudah memberikan rating untuk pengguna ini pada proyek ini",
        )

    # 5. Buat rating baru
    new_rating = Rating(
        project_id=body.project_id,
        dari_user_id=current_user.id,
        ke_user_id=body.ke_user_id,
        skor=body.skor,
        ulasan=body.ulasan,
    )
    db.add(new_rating)
    db.flush()

    # 6. Auto-update reputasi (rating_avg) profil mahasiswa jika penerima adalah mahasiswa
    mhs_profile = (
        db.query(ProfileMhs).filter(ProfileMhs.user_id == body.ke_user_id).first()
    )
    if mhs_profile:
        avg_score = (
            db.query(func.avg(Rating.skor))
            .filter(Rating.ke_user_id == body.ke_user_id)
            .scalar()
        )
        mhs_profile.rating_avg = (
            Decimal(str(round(avg_score, 2)))
            if avg_score
            else Decimal(str(body.skor))
        )
        mhs_profile.total_proyek_selesai += 1

    # 7. Auto-update reputasi (rating_avg) profil UMKM jika penerima adalah UMKM
    umkm_profile = (
        db.query(ProfileUmkm).filter(ProfileUmkm.user_id == body.ke_user_id).first()
    )
    if umkm_profile:
        avg_score = (
            db.query(func.avg(Rating.skor))
            .filter(Rating.ke_user_id == body.ke_user_id)
            .scalar()
        )
        umkm_profile.rating_avg = (
            Decimal(str(round(avg_score, 2)))
            if avg_score
            else Decimal(str(body.skor))
        )
        umkm_profile.total_proyek_selesai += 1

    db.commit()
    db.refresh(new_rating)

    dari_nama = current_user.email.split("@")[0]
    if current_user.profile_mhs and current_user.profile_mhs.nama_lengkap:
        dari_nama = current_user.profile_mhs.nama_lengkap
    elif current_user.profile_umkm and current_user.profile_umkm.nama_usaha:
        dari_nama = current_user.profile_umkm.nama_usaha

    return RatingResponse(
        id=new_rating.id,
        project_id=new_rating.project_id,
        dari_user_id=new_rating.dari_user_id,
        ke_user_id=new_rating.ke_user_id,
        skor=new_rating.skor,
        ulasan=new_rating.ulasan,
        created_at=new_rating.created_at,
        project_judul=project.judul,
        dari_nama=dari_nama,
    )


def _resolve_dari_nama(r: Rating) -> str:
    if r.dari_user:
        if r.dari_user.profile_mhs and r.dari_user.profile_mhs.nama_lengkap:
            return r.dari_user.profile_mhs.nama_lengkap
        if r.dari_user.profile_umkm and r.dari_user.profile_umkm.nama_usaha:
            return r.dari_user.profile_umkm.nama_usaha
        if r.dari_user.email:
            return r.dari_user.email.split("@")[0]
    return "Pengguna Makarya"


@router.get("/user/{user_id}", response_model=List[RatingResponse])
def get_user_ratings(user_id: UUID, db: Session = Depends(get_db)):
    """Melihat Seluruh Ulasan yang Diterima oleh Suatu Pengguna"""
    ratings = (
        db.query(Rating)
        .filter(Rating.ke_user_id == user_id)
        .order_by(Rating.created_at.desc())
        .all()
    )
    results = []
    for r in ratings:
        results.append(
            RatingResponse(
                id=r.id,
                project_id=r.project_id,
                dari_user_id=r.dari_user_id,
                ke_user_id=r.ke_user_id,
                skor=r.skor,
                ulasan=r.ulasan,
                created_at=r.created_at,
                project_judul=r.project.judul if r.project else None,
                dari_nama=_resolve_dari_nama(r),
            )
        )
    return results


@router.get("/project/{project_id}", response_model=List[RatingResponse])
def get_project_ratings(project_id: UUID, db: Session = Depends(get_db)):
    """Melihat Seluruh Ulasan yang Terkait dengan Suatu Proyek"""
    ratings = (
        db.query(Rating)
        .filter(Rating.project_id == project_id)
        .order_by(Rating.created_at.desc())
        .all()
    )
    results = []
    for r in ratings:
        results.append(
            RatingResponse(
                id=r.id,
                project_id=r.project_id,
                dari_user_id=r.dari_user_id,
                ke_user_id=r.ke_user_id,
                skor=r.skor,
                ulasan=r.ulasan,
                created_at=r.created_at,
                project_judul=r.project.judul if r.project else None,
                dari_nama=_resolve_dari_nama(r),
            )
        )
    return results