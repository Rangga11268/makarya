from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class ProfileMhs(Base):
    __tablename__ = "profile_mhs"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    prodi_id = Column(Integer, ForeignKey("master_prodi.id", ondelete="SET NULL"), nullable=True)
    nama_lengkap = Column(String(100), nullable=False)
    nim = Column(String(20), unique=True, nullable=True)
    url_ktm = Column(Text, nullable=True)
    url_foto = Column(Text, nullable=True)
    url_portofolio = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    rating_avg = Column(Numeric(precision=3, scale=2), default=0.00, nullable=False)
    total_proyek_selesai = Column(Integer, default=0, nullable=False)

    # Relationship
    user = relationship("User", back_populates="profile_mhs")
    prodi = relationship("MasterProdi", back_populates="mahasiswa")
    skills = relationship("MhsSkill", back_populates="mahasiswa", cascade="all, delete-orphan")


class ProfileUmkm(Base):
    __tablename__ = "profile_umkm"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    nama_usaha = Column(String(100), nullable=False)
    bidang_industri = Column(String(100), nullable=False)
    alamat = Column(Text, nullable=True)
    kota = Column(String(100), nullable=True)
    no_kontak = Column(String(20), nullable=True)
    url_foto_usaha = Column(Text, nullable=True)

    # Relationship
    user = relationship("User", back_populates="profile_umkm")