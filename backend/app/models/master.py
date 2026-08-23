from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class MasterProdi(Base):
    __tablename__ = "master_prodi"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nama_prodi = Column(String(100), unique=True, nullable=False)
    fakultas = Column(String(100), nullable=False)

    # Relationship
    mahasiswa = relationship("ProfileMhs", back_populates="prodi")

class MasterSkill(Base):
    __tablename__ = "master_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    kategori = Column(String(100), nullable=False, index=True)
    nama_skill = Column(String(100), unique=True, nullable=False)

    # Relationship
    mhs_skills = relationship("MhsSkill", back_populates="skill", cascade="all, delete-orphan")