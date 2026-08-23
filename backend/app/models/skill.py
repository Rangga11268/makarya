from enum import Enum
from sqlalchemy import Column, ForeignKey, Integer, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class SkillLevel(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"



class MhsSkill(Base):
    __tablename__ = "mhs_skill"

    mhs_id = Column(UUID(as_uuid=True), ForeignKey("profile_mhs.user_id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("master_skills.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    tingkat = Column(SqlEnum(SkillLevel, name="skill_level_enum"), default=SkillLevel.BEGINNER, nullable=False)

    # Relationship
    mahasiswa = relationship("ProfileMhs", back_populates="skills")
    skill = relationship("MasterSkill", back_populates="mhs_skills")