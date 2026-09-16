import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.database.models import Patient, Assessment, PredictionResult, GroupedExplanation, TriageResult
from app.api.router import api_router
from app.ml.synthetic_generator import generate_synthetic_cohort, save_synthetic_dataset
from app.ml.fusion_engine import fusion_engine
from app.ml.grouped_xai import grouped_explainer
from app.ml.triage_engine import triage_engine

# Create all tables if they do not exist
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Generate synthetic dataset files
    save_synthetic_dataset("./data/synthetic")
    
    # Auto-seed database if empty
    db = SessionLocal()
    try:
        count = db.query(Patient).count()
        if count == 0:
            print("Database empty. Seeding with realistic synthetic cohort...")
            cohort = generate_synthetic_cohort(40) # Seed 40 diverse patient assessments
            for item in cohort:
                patient = Patient(
                    patient_id=item["patient_id"],
                    age=item["age"],
                    sex=item["sex"],
                    education_years=item["education_years"],
                    apoe4_allele_count=item["apoe4_allele_count"]
                )
                db.add(patient)
                db.flush()

                # Run ML pipeline for seeded patient
                features = {
                    "age": item["age"],
                    "sex": item["sex"],
                    "education_years": item["education_years"],
                    "apoe4_allele_count": item["apoe4_allele_count"],
                    "mmse": item["mmse"],
                    "cdrsb": item["cdrsb"],
                    "adas_cog13": item["adas_cog13"],
                    "memory_score": item["memory_score"],
                    "executive_func": item["executive_func"],
                    "language_score": item["language_score"],
                    "faq_score": item["faq_score"]
                }
                
                fusion_res = fusion_engine.fuse(
                    features=features,
                    clinical_available=item["clinical_available"],
                    mri_available=item["mri_available"],
                    pet_available=item["pet_available"]
                )
                
                xai_res = grouped_explainer.explain(
                    features=features,
                    dynamic_weights=fusion_res["dynamic_weights"],
                    trajectory_stage=fusion_res["trajectory_stage"],
                    region_attentions=fusion_res["region_attentions"]
                )
                
                triage_res = triage_engine.evaluate(
                    trajectory_stage=fusion_res["trajectory_stage"],
                    confidence=fusion_res["confidence"],
                    uncertainty_score=fusion_res["uncertainty_score"],
                    modalities={
                        "clinical": item["clinical_available"],
                        "mri": item["mri_available"],
                        "pet": item["pet_available"]
                    },
                    features=features
                )

                assessment = Assessment(
                    patient_id=patient.id,
                    mmse=item["mmse"],
                    cdrsb=item["cdrsb"],
                    adas_cog13=item["adas_cog13"],
                    memory_score=item["memory_score"],
                    executive_func=item["executive_func"],
                    language_score=item["language_score"],
                    faq_score=item["faq_score"],
                    clinical_available=item["clinical_available"],
                    mri_available=item["mri_available"],
                    pet_available=item["pet_available"]
                )
                db.add(assessment)
                db.flush()

                pred = PredictionResult(
                    assessment_id=assessment.id,
                    trajectory_stage=fusion_res["trajectory_stage"],
                    confidence=fusion_res["confidence"],
                    uncertainty_score=fusion_res["uncertainty_score"],
                    risk_level=fusion_res["risk_level"],
                    stage_probabilities=fusion_res["stage_probabilities"],
                    clinical_weight=fusion_res["dynamic_weights"]["clinical"],
                    mri_weight=fusion_res["dynamic_weights"]["mri"],
                    pet_weight=fusion_res["dynamic_weights"]["pet"],
                    clinical_score_normalized=fusion_res["clinical_score_normalized"],
                    imaging_score_normalized=fusion_res["imaging_score_normalized"]
                )
                db.add(pred)

                expl = GroupedExplanation(
                    assessment_id=assessment.id,
                    cognitive_contrib=xai_res["cognitive_contrib"],
                    imaging_contrib=xai_res["imaging_contrib"],
                    demographic_contrib=xai_res["demographic_contrib"],
                    genetic_contrib=xai_res["genetic_contrib"],
                    functional_contrib=xai_res["functional_contrib"],
                    detailed_features=xai_res["detailed_features"],
                    imaging_regions=xai_res["imaging_regions"]
                )
                db.add(expl)

                tri = TriageResult(
                    assessment_id=assessment.id,
                    triage_status=triage_res["status"],
                    triage_title=triage_res["title"],
                    recommendation=triage_res["recommendation"],
                    rationale=triage_res["rationale"],
                    suggested_actions=triage_res["suggested_actions"]
                )
                db.add(tri)

            db.commit()
            print(f"Seeded {len(cohort)} patient records into database.")
    finally:
        db.close()

    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable Multimodal AI for Alzheimer's Risk Stratification & Clinical Triage Prototype",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "disclaimer": "RESEARCH / CLINICAL DECISION SUPPORT PROTOTYPE ONLY - Not for clinical diagnosis.",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NeuroTriage Backend",
        "demo_mode": settings.DEMO_MODE
    }

@app.get("/api/model/status")
def model_status():
    return {
        "model_status": "READY",
        "version": "1.0.0-research-ensemble",
        "branches": {
            "clinical_tabular": "XGBoost / ADNI Cognitive Calibration [ACTIVE]",
            "neuroimaging_3d_cnn": "Spatial Region Feature Extractor (Hippocampus/Cortex/Ventricles) [ACTIVE]",
            "dynamic_weighting": "Adaptive Modality Weighting Engine [ACTIVE]",
            "grouped_xai": "Owen-Value 5-Domain Feature Explainer [ACTIVE]",
            "triage_engine": "Confidence-Calibrated Action Layer [ACTIVE]"
        },
        "demo_mode": settings.DEMO_MODE,
        "disclaimer": "Simulated prototype inference mode for reproducible academic demonstration."
    }
