from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PatientBase(BaseModel):
    patient_id: str = Field(..., description="Unique anonymized patient identifier, e.g. PT-94021")
    age: float = Field(..., ge=45, le=100, description="Age in years (45-100)")
    sex: str = Field(..., description="'Male' or 'Female'")
    education_years: float = Field(..., ge=0, le=30, description="Years of formal education")
    apoe4_allele_count: int = Field(0, ge=0, le=2, description="APOE-ε4 allele count (0, 1, or 2)")

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
