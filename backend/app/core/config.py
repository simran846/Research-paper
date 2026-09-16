from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "NeuroTriage AI"
    PROJECT_TAGLINE: str = "Explainable Multimodal AI for Alzheimer's Risk Stratification"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DEMO_MODE: bool = True
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neurotriage.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Model configuration
    DEFAULT_CLINICAL_WEIGHT: float = 0.40
    DEFAULT_MRI_WEIGHT: float = 0.35
    DEFAULT_PET_WEIGHT: float = 0.25
    
    # Uncertainty thresholds for triage
    HIGH_CONFIDENCE_THRESHOLD: float = 0.82
    MODERATE_CONFIDENCE_THRESHOLD: float = 0.65
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
