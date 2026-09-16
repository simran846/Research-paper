from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime

class AssessmentInput(BaseModel):
    # Demographics & Genetics
    patient_id: str = Field(..., description="Unique anonymized patient identifier")
    age: float = Field(..., ge=45, le=100)
    sex: str = Field(..., description="'Male' or 'Female'")
    education_years: float = Field(16.0, ge=0, le=30)
    apoe4_allele_count: int = Field(0, ge=0, le=2)

    # Clinical / Cognitive Features
    mmse: float = Field(..., ge=0, le=30, description="Mini-Mental State Exam (0-30)")
    cdrsb: float = Field(..., ge=0, le=18, description="CDR Sum of Boxes (0-18)")
    adas_cog13: float = Field(..., ge=0, le=85, description="ADAS-Cog 13 (0-85)")
    memory_score: float = Field(..., ge=-4.0, le=4.0, description="Standardized memory composite score")
    executive_func: float = Field(..., ge=-4.0, le=4.0, description="Standardized executive composite score")
    language_score: float = Field(..., ge=-4.0, le=4.0, description="Standardized language composite score")
    faq_score: float = Field(..., ge=0, le=30, description="Functional Activities Questionnaire score")

    # Modality Availability Flags
    clinical_available: bool = True
    mri_available: bool = False
    pet_available: bool = False

    # Optional uploaded file references
    mri_file_id: Optional[str] = None
    pet_file_id: Optional[str] = None


class ModalityWeightsSchema(BaseModel):
    clinical: float
    mri: float
    pet: float


class GroupedExplanationSchema(BaseModel):
    cognitive_contrib: float
    imaging_contrib: float
    demographic_contrib: float
    genetic_contrib: float
    functional_contrib: float
    detailed_features: Dict[str, float]
    imaging_regions: Dict[str, float]


class TriageOutputSchema(BaseModel):
    status: str
    title: str
    recommendation: str
    rationale: str
    suggested_actions: List[str]


class AssessmentResponse(BaseModel):
    id: int
    patient_id: str
    assessment_date: datetime
    
    # Input Modalities
    modalities: Dict[str, bool]
    
    # Core outputs
    trajectory_stage: str # 'Normal Aging', 'Early MCI', 'Late MCI', 'Alzheimer\'s Disease'
    confidence: float
    uncertainty_score: float
    risk_level: str # 'Low', 'Moderate', 'High', 'Severe'
    stage_probabilities: Dict[str, float]
    
    # Dynamic Modality Weights
    dynamic_weights: ModalityWeightsSchema
    
    # Explainable AI
    explanations: GroupedExplanationSchema
    
    # AI Triage
    triage: TriageOutputSchema
    
    # Clinical raw values for reference
    clinical_values: Dict[str, Any]
    
    demo_mode: bool = True
    disclaimer: str = "RESEARCH PROTOTYPE ONLY - Not for clinical diagnosis or prescription."

    class Config:
        from_attributes = True


class ChatMessageRequest(BaseModel):
    assessment_id: Optional[int] = None
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []


class ChatMessageResponse(BaseModel):
    reply: str
    suggested_followups: List[str]
    context_used: Dict[str, Any]
