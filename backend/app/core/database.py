from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator
from app.core.config import settings

# Engine koneksi ke database

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)

# Buat sesi factory untuk mengelola sesi database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model deklarasi buat semua table orm
Base = declarative_base()

# Dependesi buat generator sesi database
def get_db() -> Generator:
    # Buat sesi database baru
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()