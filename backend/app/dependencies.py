from typing import Generator, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole

# oauth2 password bearer untuk mendapatkan token dari header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login")

# Mendapatkan user dari token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # Decode token untuk mendapatkan payload
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    # Ambil user_id dari payload token
    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception
    
    # Ambil user dari database berdasarkan user_id
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception

    # Security check: pastikan role user sesuai dengan role yang diizinkan
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun anda tidak aktif. Silakan hubungi admin untuk mengaktifkan akun Anda.",
        )
    return user

    # Require role
def require_role(*allowed_roles: List[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user))-> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak. Anda harus memiliki salah satu peran berikut: {', '.join(role.value for role in allowed_roles)}.",
            )
        return current_user
    return role_checker
        