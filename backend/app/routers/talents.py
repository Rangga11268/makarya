from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.profile import ProfileMhs, ProfileUmkm
from app.models.master import MasterProdi
from app.models.rating import Rating
from app.schemas.talent import TalentResponse, TalentReview

router = APIRouter(prefix="/talents", tags=["Talents & Directory"])


def _infer_skills(mhs: ProfileMhs) -> List[str]:
    """Helper untuk mendapatkan keahlian mahasiswa."""
    explicit_skills = [s.skill.nama_skill for s in mhs.skills if s.skill and s.skill.nama_skill]
    if explicit_skills:
        return explicit_skills

    prodi_name = (mhs.prodi.nama_prodi if mhs.prodi else "").lower()
    if "sistem informasi" in prodi_name:
        return ["FastAPI", "React.js", "PostgreSQL", "Tailwind CSS"]
    elif "komunikasi visual" in prodi_name or "dkv" in prodi_name:
        return ["Figma", "Branding", "Logo Design", "Adobe Illustrator"]
    elif "teknologi informasi" in prodi_name or "informatika" in prodi_name:
        return ["Landing Page", "Next.js", "REST API", "Database"]
    elif "komunikasi" in prodi_name:
        return ["Copywriting", "Social Media", "Content Plan", "Storytelling"]
    return ["Digital Marketing", "Content Creation", "Office & Excel"]


def _format_talent(mhs: ProfileMhs, db: Session) -> TalentResponse:
    ratings = (
        db.query(Rating)
        .filter(Rating.ke_user_id == mhs.user_id)
        .order_by(Rating.created_at.desc())
        .all()
    )

    recent_reviews = []
    for r in ratings[:3]:
        # Cari nama pengulas (biasanya UMKM)
        umkm_p = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == r.dari_user_id).first()
        client_name = umkm_p.nama_usaha if umkm_p and umkm_p.nama_usaha else "Klien Terverifikasi"

        recent_reviews.append(
            TalentReview(
                id=r.id,
                project_id=r.project_id,
                client_name=client_name,
                skor=r.skor,
                ulasan=r.ulasan or "Penyelesaian proyek sangat memuaskan dan tepat waktu.",
                created_at=r.created_at,
            )
        )

    # Hitung average score jika rating_avg di profile masih 0 tapi ada data di ratings
    calc_rating = float(mhs.rating_avg or 0.0)
    if calc_rating == 0.0 and ratings:
        calc_rating = round(sum(r.skor for r in ratings) / len(ratings), 2)

    return TalentResponse(
        id=mhs.user_id,
        nama_lengkap=mhs.nama_lengkap,
        email=mhs.user.email if mhs.user else "",
        nim=mhs.nim,
        prodi=mhs.prodi.nama_prodi if mhs.prodi else "Sistem Informasi",
        url_foto=mhs.url_foto,
        url_portofolio=mhs.url_portofolio or "https://github.com/makarya-talent",
        bio=mhs.bio,
        rating_avg=calc_rating,
        total_proyek_selesai=mhs.total_proyek_selesai,
        skills=_infer_skills(mhs),
        reviews_count=len(ratings),
        recent_reviews=recent_reviews,
    )


@router.get("", response_model=List[TalentResponse])
def get_talents(
    prodi: Optional[str] = Query(None, description="Filter program studi"),
    keyword: Optional[str] = Query(None, description="Pencarian nama atau bio"),
    min_rating: Optional[float] = Query(None, ge=0.0, le=5.0, description="Minimum rating"),
    only_completed: Optional[bool] = Query(False, description="Hanya mahasiswa yang telah menyelesaikan proyek / berating"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Mengambil direktori mahasiswa berprestasi dan terverifikasi secara riil dari database.
    """
    query = (
        db.query(ProfileMhs)
        .join(User, ProfileMhs.user_id == User.id)
        .outerjoin(MasterProdi, ProfileMhs.prodi_id == MasterProdi.id)
        .filter(User.role == UserRole.MHS)
        .filter(User.is_active == True)
    )

    if only_completed:
        query = query.filter(
            or_(
                ProfileMhs.total_proyek_selesai > 0,
                ProfileMhs.rating_avg > 0,
            )
        )

    if min_rating is not None and min_rating > 0:
        query = query.filter(ProfileMhs.rating_avg >= min_rating)

    if prodi:
        query = query.filter(MasterProdi.nama_prodi.ilike(f"%{prodi}%"))

    if keyword:
        search_kw = f"%{keyword.strip()}%"
        query = query.filter(
            or_(
                ProfileMhs.nama_lengkap.ilike(search_kw),
                ProfileMhs.bio.ilike(search_kw),
                ProfileMhs.nim.ilike(search_kw),
            )
        )

    # Urutkan berdasarkan rating terbaik lalu total proyek selesai
    query = query.order_by(
        ProfileMhs.rating_avg.desc(),
        ProfileMhs.total_proyek_selesai.desc(),
        ProfileMhs.nama_lengkap.asc(),
    )

    mhs_list = query.offset(skip).limit(limit).all()
    return [_format_talent(m, db) for m in mhs_list]


@router.get("/{user_id}", response_model=TalentResponse)
def get_talent_detail(user_id: UUID, db: Session = Depends(get_db)):
    """
    Mengambil profil detail seorang talenta mahasiswa beserta ulasan lengkap dari klien.
    """
    mhs = db.query(ProfileMhs).filter(ProfileMhs.user_id == user_id).first()
    if not mhs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Talenta mahasiswa tidak ditemukan.",
        )

    return _format_talent(mhs, db)
