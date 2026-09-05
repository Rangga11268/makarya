from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.user import UserRole

# Schema untuk request register UMKM
class RegisterUmkmRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password harus memiliki minimal 8 karakter.")
    nama_usaha: str = Field(..., min_length=2, max_length=100)
    bidang_industri: str = Field(..., min_length=2, max_length=100)
    kota: Optional[str] = Field(None, max_length=100)
    no_kontak: Optional[str] = Field(None, max_length=20)


# Schema untuk request register Mahasiswa(Validasi domain .ac.id/.edu)
class RegisterMhsRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password harus memiliki minimal 8 karakter.")
    nama_lengkap: str = Field(..., min_length=2, max_length=100)
    prodi_id: Optional[int] = None
    nim : Optional[str] = Field(None, max_length=20)

    @field_validator("email")
    @classmethod
    def validate_campus_email(cls, v:str) -> str:
        v = v.lower()
        if not v.endswith(".ac.id") and not v.endswith(".edu"):
            raise ValueError("Email harus berakhiran .ac.id atau .edu")
        return v

# Schema Request Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Schema untuk response token(Dikembalikan setelah login / Regis Berhasil)
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: UUID
    email: str
    role: UserRole
    is_verified: bool

# Schema untuk request refresh token
class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Schema untuk Verifikasi OTP
class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=4, max_length=8)


class ResendOtpRequest(BaseModel):
    email: EmailStr


# Schema untuk Lupa & Reset Password
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=4, max_length=8)
    new_password: str = Field(..., min_length=8)


# Schema untuk Otentikasi Google OAuth
class GoogleAuthRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    google_id: Optional[str] = None
    photo_url: Optional[str] = None
    role: Optional[UserRole] = UserRole.UMKM