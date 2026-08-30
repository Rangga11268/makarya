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
from app.models.wallet import Wallet
from app.schemas.auth import (
    RegisterUmkmRequest,
    RegisterMhsRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
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
        is_verified=True,
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
        is_verified=new_user.is_active,
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
        is_verified=True,
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
        is_verified=new_user.is_active,
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


@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    # Cek data akun yang sedang login (protected route)
    return {
        "id" : current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_verified": current_user.is_active,
        "created_at": current_user.created_at,
    }