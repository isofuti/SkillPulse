from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

# Таблица связи вакансий и навыков
vacancy_skills = Table(
    'vacancy_skills',
    Base.metadata,
    Column('vacancy_id', Integer, ForeignKey('vacancy.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skill.id'), primary_key=True),
    Column('frequency', Integer, default=1)
)

class Snapshot(Base):
    __tablename__ = "snapshot"
    
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)
    area_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_vacancies = Column(Integer, nullable=False)
    avg_salary = Column(Numeric)
    median_salary = Column(Numeric)
    
    vacancies = relationship("Vacancy", back_populates="snapshot")
    skill_stats = relationship("SkillStat", back_populates="snapshot")

class Vacancy(Base):
    __tablename__ = "vacancy"
    
    id = Column(Integer, primary_key=True)
    snapshot_id = Column(Integer, ForeignKey("snapshot.id"))
    name = Column(String, nullable=False)
    employer_name = Column(String)
    salary_from = Column(Numeric)
    salary_to = Column(Numeric)
    salary_currency = Column(String)
    requirement = Column(String)
    responsibility = Column(String)
    url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    snapshot = relationship("Snapshot", back_populates="vacancies")
    skills = relationship("Skill", secondary=vacancy_skills, back_populates="vacancies")

class Skill(Base):
    __tablename__ = "skill"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    vacancies = relationship("Vacancy", secondary=vacancy_skills, back_populates="skills")
    stats = relationship("SkillStat", back_populates="skill")

class SkillStat(Base):
    __tablename__ = "skill_stat"
    
    snapshot_id = Column(Integer, ForeignKey("snapshot.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skill.id"), primary_key=True)
    frequency = Column(Integer, nullable=False)
    
    snapshot = relationship("Snapshot", back_populates="skill_stats")
    skill = relationship("Skill", back_populates="stats") 