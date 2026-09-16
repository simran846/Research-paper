from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(64), unique=True, index=True, nullable=False)
    age = Column(Float, nullable=False)
    sex = Column(String(16), nullable=False) # 'Male', 'Female'
    education_years = Column(Float, nullable=False) # e.g. 16.0
    apoe4_allele_count = Column(Integer, default=0) # 0, 1, or 2
    created_at = Column(DateTime, default=datetime.utcnow)

    assessments = relationship("Assessment", back_populates="patient", cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    assessment_date = Column(DateTime, default=datetime.utcnow)
    
    # Cognitive / Clinical Scores
    mmse = Column(Float, nullable=False) # Mini-Mental State Exam (0-30)
    cdrsb = Column(Float, nullable=False) # Clinical Dementia Rating Sum of Boxes (0-18)
    adas_cog13 = Column(Float, nullable=False) # ADAS-Cog 13 (0-85)
    memory_score = Column(Float, nullable=False) # Standardized memory composite (-3.0 to +3.0)
    executive_func = Column(Float, nullable=False) # Executive function composite (-3.0 to +3.0)
    language_score = Column(Float, nullable=False) # Language composite (-3.0 to +3.0)
    faq_score = Column(Float, nullable=False) # Functional Activities Questionnaire (0-30)
    
    # Modality Availability Flags
    clinical_available = Column(Boolean, default=True)
    mri_available = Column(Boolean, default=False)
    pet_available = Column(Boolean, default=False)
    
    # Imaging File Paths / Names
    mri_path = Column(String(255), nullable=True)
    pet_path = Column(String(255), nullable=True)
    
    # Relationships
    patient = relationship("Patient", back_populates="assessments")
    prediction = relationship("PredictionResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    explanation = relationship("GroupedExplanation", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    triage = relationship("TriageResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class PredictionResult(Base):
    __tablename__ = "model_predictions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), unique=True, nullable=False)
    
    # Diagnostic Trajectory: 'Normal Aging', 'Early MCI', 'Late MCI', 'Alzheimer\'s Disease'
    trajectory_stage = Column(String(64), nullable=False)
    confidence = Column(Float, nullable=False) # 0.0 to 1.0
    uncertainty_score = Column(Float, nullable=False) # 0.0 to 1.0
    risk_level = Column(String(32), nullable=False) # 'Low', 'Moderate', 'High', 'Severe'
    
    # Class Probabilities (JSON dict: {Normal: 0.1, Early MCI: 0.7, Late MCI: 0.15, AD: 0.05})
    stage_probabilities = Column(JSON, nullable=True)
    
    # Modality Weights used in fusion
    clinical_weight = Column(Float, default=1.0)
    mri_weight = Column(Float, default=0.0)
    pet_weight = Column(Float, default=0.0)
    
    # Latent embeddings summary
    clinical_score_normalized = Column(Float, default=0.0)
    imaging_score_normalized = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assessment = relationship("Assessment", back_populates="prediction")


class GroupedExplanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), unique=True, nullable=False)
    
    # Owen-value / Grouped XAI Contributions (Sum to 100%)
    cognitive_contrib = Column(Float, nullable=False)
    imaging_contrib = Column(Float, nullable=False)
    demographic_contrib = Column(Float, nullable=False)
    genetic_contrib = Column(Float, nullable=False)
    functional_contrib = Column(Float, nullable=False)
    
    # Detailed subgroup attributions
    detailed_features = Column(JSON, nullable=True)
    imaging_regions = Column(JSON, nullable=True) # Hippocampus, Cortical, Ventricular attention
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assessment = relationship("Assessment", back_populates="explanation")


class TriageResult(Base):
    __tablename__ = "triage_results"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), unique=True, nullable=False)
    
    triage_status = Column(String(64), nullable=False) # 'HIGH_CONFIDENCE_STANDARD', 'RECOMMEND_IMAGING_CONFIRMATION', 'URGENT_MULTIDISCIPLINARY_REVIEW'
    triage_title = Column(String(128), nullable=False)
    recommendation = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    suggested_actions = Column(JSON, nullable=True) # List of recommended clinical research next steps
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assessment = relationship("Assessment", back_populates="triage")
