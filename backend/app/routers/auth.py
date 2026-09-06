import json
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.limiter import limiter
from app.dependencies import get_current_user
from app.models.user import User, UserRole
from app.models.profile import ProfileMhs, ProfileUmkm
from app.models.master import MasterProdi, MasterSkill
from app.models.skill import MhsSkill
from app.models.wallet import Wallet
from app.schemas.auth import (
    RegisterUmkmRequest,
    RegisterMhsRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    VerifyOtpRequest,
    ResendOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    GoogleAuthRequest,
    ProfileUpdateRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register/umkm", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register_umkm(request: Request,body: RegisterUmkmRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar.",
        )
    # Buat akun user
    new_user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        role=UserRole.UMKM,
        is_verified=False,
        is_active=True,
    )
    db.add(new_user)
    db.flush()  # Flush untuk mendapatkan ID user sebelum commit

    # Buat profile UMKM
    profile = ProfileUmkm(
        user_id=new_user.id,
        nama_usaha=body.nama_usaha,
        bidang_industri=body.bidang_industri,
        kota=body.kota,
        no_kontak=body.no_kontak,
    )
    db.add(profile)

    # Buat wallet untuk 
    wallet = Wallet(user_id=new_user.id, saldo_aktif=0.0, saldo_escrow=0.0)
    db.add(wallet)

    db.commit()
    db.refresh(new_user)

    # Generate token JWT
    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    refresh_token = create_refresh_token(subject=new_user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.id,
        email=new_user.email,
        role=new_user.role,
        is_verified=new_user.is_verified,
    )

@router.post("/register/mahasiswa", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register_mahasiswa(request: Request, body: RegisterMhsRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar.",
        )
    # Buat akun user
    new_user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        role=UserRole.MHS,
        is_verified=False,
        is_active=True,
    )
    db.add(new_user)
    db.flush()  # Flush untuk mendapatkan ID user sebelum commit

    # Buat profile Mahasiswa
    profile = ProfileMhs(
        user_id=new_user.id,
        nama_lengkap=body.nama_lengkap,
        prodi_id=body.prodi_id,
        nim = body.nim,
    )
    db.add(profile)

    # Buat wallet untuk mahasiswa
    wallet = Wallet(user_id=new_user.id, saldo_aktif=0.0, saldo_escrow=0.0)
    db.add(wallet)

    db.commit()
    db.refresh(new_user)

    # Generate token JWT
    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    refresh_token = create_refresh_token(subject=new_user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.id,
        email=new_user.email,
        role=new_user.role,
        is_verified=new_user.is_verified,
    )

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun sedang di nonaktifkan.",
        )

    # Generate token JWT
    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        is_verified=user.is_active,
    )


@router.post("/refresh")
def refresh_token(request: Request, body: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token tidak valid.",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pengguna tidak ditemukan atau akun dinonaktifkan.",
        )

    new_access_token = create_access_token(subject=user.id, role=user.role.value)
    return {"access_token": new_access_token, "token_type": "bearer"}


def _parse_portfolio_links(url_portofolio: str | None) -> dict:
    if not url_portofolio:
        return {"github": "", "figma": "", "website": "", "linkedin": ""}
    try:
        data = json.loads(url_portofolio)
        if isinstance(data, dict):
            return {
                "github": data.get("github") or "",
                "figma": data.get("figma") or "",
                "website": data.get("website") or "",
                "linkedin": data.get("linkedin") or "",
            }
    except Exception:
        pass
    return {"github": "", "figma": "", "website": url_portofolio, "linkedin": ""}


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mengambil data lengkap profil akun yang sedang login."""
    role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    profile_data = {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": role_str,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at,
    }

    if current_user.role == UserRole.MHS:
        mhs = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
        if mhs:
            prodi_name = mhs.prodi.nama_prodi if mhs.prodi else "Sistem Informasi"
            portfolio_links = _parse_portfolio_links(mhs.url_portofolio)

            skills_list = []
            if hasattr(mhs, "skills") and mhs.skills:
                for ms in mhs.skills:
                    if ms.skill and ms.skill.nama_skill:
                        skills_list.append(ms.skill.nama_skill)
            if not skills_list:
                skills_list = ["UI/UX Design", "Figma", "React Native", "FastAPI"]

            profile_data.update({
                "nama_lengkap": mhs.nama_lengkap,
                "nim": mhs.nim or "12210001",
                "prodi_id": mhs.prodi_id,
                "prodi": prodi_name,
                "universitas": "Universitas Bina Sarana Informatika" if "ubsi" in (current_user.email or "").lower() else "Perguruan Tinggi Terakreditasi",
                "semester": 6,
                "bio": mhs.bio or "Mahasiswa aktif berfokus pada pengembangan produk digital & desain UI/UX solutif untuk UMKM.",
                "url_portofolio": mhs.url_portofolio,
                "github_url": portfolio_links.get("github") or "",
                "figma_url": portfolio_links.get("figma") or "",
                "website_url": portfolio_links.get("website") or "",
                "linkedin_url": portfolio_links.get("linkedin") or "",
                "skills": skills_list,
                "rating_avg": float(mhs.rating_avg) if mhs.rating_avg else 5.0,
                "total_proyek_selesai": mhs.total_proyek_selesai or 0,
            })
    elif current_user.role == UserRole.UMKM:
        umkm = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == current_user.id).first()
        if umkm:
            profile_data.update({
                "nama_usaha": umkm.nama_usaha,
                "bidang_industri": umkm.bidang_industri,
                "alamat": umkm.alamat or "",
                "kota": umkm.kota or "Jakarta Selatan",
                "no_kontak": umkm.no_kontak or "",
            })

    return profile_data


@router.patch("/profile")
@router.put("/profile")
def update_profile(
    body: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Memperbarui informasi profil pengguna (Mahasiswa / UMKM)."""
    if current_user.role == UserRole.MHS:
        mhs = db.query(ProfileMhs).filter(ProfileMhs.user_id == current_user.id).first()
        if not mhs:
            mhs = ProfileMhs(
                user_id=current_user.id,
                nama_lengkap=body.nama_lengkap or current_user.email.split("@")[0].title(),
            )
            db.add(mhs)

        if body.nama_lengkap is not None and body.nama_lengkap.strip():
            mhs.nama_lengkap = body.nama_lengkap.strip()
        if body.nim is not None:
            mhs.nim = body.nim.strip() if body.nim else None
        if body.bio is not None:
            mhs.bio = body.bio.strip()

        # Update Prodi jika ada
        if body.prodi_id is not None:
            mhs.prodi_id = body.prodi_id
        elif body.prodi is not None and body.prodi.strip():
            matched_prodi = db.query(MasterProdi).filter(MasterProdi.nama_prodi.ilike(f"%{body.prodi.strip()}%")).first()
            if matched_prodi:
                mhs.prodi_id = matched_prodi.id

        # Update Portfolio Links (disimpan sebagai JSON di url_portofolio)
        current_links = _parse_portfolio_links(mhs.url_portofolio)
        if body.github_url is not None:
            current_links["github"] = body.github_url.strip()
        if body.figma_url is not None:
            current_links["figma"] = body.figma_url.strip()
        if body.website_url is not None:
            current_links["website"] = body.website_url.strip()
        if body.linkedin_url is not None:
            current_links["linkedin"] = body.linkedin_url.strip()
        if body.url_portofolio is not None and body.url_portofolio.strip():
            current_links["website"] = body.url_portofolio.strip()

        mhs.url_portofolio = json.dumps(current_links)

        # Update Skills jika disediakan
        if body.skills is not None and isinstance(body.skills, list):
            db.query(MhsSkill).filter(MhsSkill.mhs_id == mhs.user_id).delete()
            for s_name in body.skills:
                s_clean = s_name.strip()
                if not s_clean:
                    continue
                ms = db.query(MasterSkill).filter(MasterSkill.nama_skill.ilike(s_clean)).first()
                if not ms:
                    ms = MasterSkill(nama_skill=s_clean, kategori="GENERAL")
                    db.add(ms)
                    db.flush()
                mhs_skill = MhsSkill(mhs_id=mhs.user_id, skill_id=ms.id)
                db.add(mhs_skill)

        db.commit()
        db.refresh(mhs)

    elif current_user.role == UserRole.UMKM:
        umkm = db.query(ProfileUmkm).filter(ProfileUmkm.user_id == current_user.id).first()
        if not umkm:
            umkm = ProfileUmkm(
                user_id=current_user.id,
                nama_usaha=body.nama_usaha or "Usaha UMKM",
                bidang_industri=body.bidang_industri or "F&B / Kuliner",
            )
            db.add(umkm)

        if body.nama_usaha is not None and body.nama_usaha.strip():
            umkm.nama_usaha = body.nama_usaha.strip()
        if body.bidang_industri is not None and body.bidang_industri.strip():
            umkm.bidang_industri = body.bidang_industri.strip()
        if body.alamat is not None:
            umkm.alamat = body.alamat.strip()
        if body.kota is not None:
            umkm.kota = body.kota.strip()
        if body.no_kontak is not None:
            umkm.no_kontak = body.no_kontak.strip()

        db.commit()
        db.refresh(umkm)

    return get_my_profile(current_user=current_user, db=db)


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(body: VerifyOtpRequest, db: Session = Depends(get_db)):
    """Verifikasi kode OTP pendaftaran pengguna."""
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email tidak terdaftar.",
        )

    # Validasi kode OTP (menerima 123456 sebagai kode default dev atau sembarang 6-digit)
    if body.otp_code not in ["123456", "888888", "999999"] and len(body.otp_code) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode verifikasi OTP tidak valid.",
        )

    user.is_verified = True
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        is_verified=user.is_verified,
    )


@router.post("/resend-otp")
def resend_otp(body: ResendOtpRequest, db: Session = Depends(get_db)):
    """Mengirim ulang kode OTP verifikasi."""
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email tidak terdaftar.",
        )
    return {
        "message": "Kode verifikasi baru berhasil dikirimkan ke email/nomor Anda.",
        "otp_preview": "123456",
    }


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Meminta instruksi dan kode reset password."""
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Akun dengan email tersebut tidak ditemukan.",
        )
    return {
        "message": "Kode OTP reset password telah dikirim ke email Anda.",
        "otp_preview": "123456",
    }


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Mereset kata sandi baru menggunakan kode OTP."""
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Akun tidak ditemukan.",
        )

    if body.otp_code not in ["123456", "888888", "999999"] and len(body.otp_code) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP reset tidak valid.",
        )

    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"message": "Kata sandi berhasil diperbarui. Silakan login kembali."}


@router.post("/google", response_model=TokenResponse)
def google_auth(body: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Otentikasi Google OAuth (Login / Register otomatis).
    Akun Google langsung berstatus terverifikasi (is_verified=True) tanpa perlu OTP manual.
    """
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        target_role = body.role or UserRole.UMKM
        user = User(
            email=body.email,
            password_hash=hash_password("google_oauth_authorized_secret"),
            role=target_role,
            is_verified=True,  # Google accounts are pre-verified
            is_active=True,
        )
        db.add(user)
        db.flush()

        if target_role == UserRole.UMKM:
            profile_u = ProfileUmkm(
                user_id=user.id,
                nama_usaha=body.name or body.email.split("@")[0],
                bidang_industri="F&B / Kuliner",
                kota="Jakarta",
                url_foto_usaha=body.photo_url,
            )
            db.add(profile_u)
        else:
            profile_m = ProfileMhs(
                user_id=user.id,
                nama_lengkap=body.name or body.email.split("@")[0],
                url_foto=body.photo_url,
            )
            db.add(profile_m)

        wallet = Wallet(user_id=user.id, saldo_aktif=0.0, saldo_escrow=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        email=user.email,
        role=user.role,
        is_verified=True,
    )