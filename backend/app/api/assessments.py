from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.session import get_db
from app.database.models import Patient, Assessment, PredictionResult, GroupedExplanation, TriageResult
from app.schemas.assessment import AssessmentInput, AssessmentResponse
from app.ml.fusion_engine import fusion_engine
from app.ml.grouped_xai import grouped_explainer
from app.ml.triage_engine import triage_engine

router = APIRouter(prefix="/assessment", tags=["Assessment"])

def _format_assessment_response(assessment: Assessment) -> dict:
    patient = assessment.patient
    pred = assessment.prediction
    expl = assessment.explanation
    tri = assessment.triage

    return {
        "id": assessment.id,
        "patient_id": patient.patient_id if patient else "UNKNOWN",
        "assessment_date": assessment.assessment_date,
        "modalities": {
            "clinical": assessment.clinical_available,
            "mri": assessment.mri_available,
            "pet": assessment.pet_available
        },
        "trajectory_stage": pred.trajectory_stage if pred else "Normal Aging",
        "confidence": pred.confidence if pred else 0.85,
        "uncertainty_score": pred.uncertainty_score if pred else 0.15,
        "risk_level": pred.risk_level if pred else "Low",
        "stage_probabilities": pred.stage_probabilities if pred and pred.stage_probabilities else {
            "Normal Aging": 0.85, "Early MCI": 0.10, "Late MCI": 0.04, "Alzheimer's Disease": 0.01
        },
        "dynamic_weights": {
            "clinical": pred.clinical_weight if pred else 1.0,
            "mri": pred.mri_weight if pred else 0.0,
            "pet": pred.pet_weight if pred else 0.0
        },
        "explanations": {
            "cognitive_contrib": expl.cognitive_contrib if expl else 40.0,
            "imaging_contrib": expl.imaging_contrib if expl else 0.0,
            "demographic_contrib": expl.demographic_contrib if expl else 20.0,
            "genetic_contrib": expl.genetic_contrib if expl else 15.0,
            "functional_contrib": expl.functional_contrib if expl else 25.0,
            "detailed_features": expl.detailed_features if expl and expl.detailed_features else {},
            "imaging_regions": expl.imaging_regions if expl and expl.imaging_regions else {
                "Hippocampus (Medial Temporal)": 0.0,
                "Cortical Mantle (Parietotemporal)": 0.0,
                "Lateral Ventricles (CSF Ex-vacuo)": 0.0
            }
        },
        "triage": {
            "status": tri.triage_status if tri else "HIGH_CONFIDENCE_STANDARD",
            "title": tri.triage_title if tri else "Standard Follow-Up",
            "recommendation": tri.recommendation if tri else "Routine monitoring.",
            "rationale": tri.rationale if tri else "Stable biomarkers.",
            "suggested_actions": tri.suggested_actions if tri and tri.suggested_actions else []
        },
        "clinical_values": {
            "age": patient.age if patient else 70,
            "sex": patient.sex if patient else "Female",
            "education_years": patient.education_years if patient else 16.0,
            "apoe4_allele_count": patient.apoe4_allele_count if patient else 0,
            "mmse": assessment.mmse,
            "cdrsb": assessment.cdrsb,
            "adas_cog13": assessment.adas_cog13,
            "memory_score": assessment.memory_score,
            "executive_func": assessment.executive_func,
            "language_score": assessment.language_score,
            "faq_score": assessment.faq_score
        },
        "demo_mode": True,
        "disclaimer": "RESEARCH PROTOTYPE ONLY - Not for clinical diagnosis or prescription."
    }

@router.post("/", response_model=AssessmentResponse)
@router.post("", response_model=AssessmentResponse)
def run_assessment(input_data: AssessmentInput, db: Session = Depends(get_db)):
    # 1. Get or Create Patient
    patient = db.query(Patient).filter(Patient.patient_id == input_data.patient_id).first()
    if not patient:
        patient = Patient(
            patient_id=input_data.patient_id,
            age=input_data.age,
            sex=input_data.sex,
            education_years=input_data.education_years,
            apoe4_allele_count=input_data.apoe4_allele_count
        )
        db.add(patient)
        db.flush()
    else:
        # Update demographics if provided
        patient.age = input_data.age
        patient.sex = input_data.sex
        patient.education_years = input_data.education_years
        patient.apoe4_allele_count = input_data.apoe4_allele_count

    # 2. Build feature dictionary
    features = {
        "age": input_data.age,
        "sex": input_data.sex,
        "education_years": input_data.education_years,
        "apoe4_allele_count": input_data.apoe4_allele_count,
        "mmse": input_data.mmse,
        "cdrsb": input_data.cdrsb,
        "adas_cog13": input_data.adas_cog13,
        "memory_score": input_data.memory_score,
        "executive_func": input_data.executive_func,
        "language_score": input_data.language_score,
        "faq_score": input_data.faq_score
    }

    # 3. Run Multimodal Fusion Engine
    fusion_res = fusion_engine.fuse(
        features=features,
        clinical_available=input_data.clinical_available,
        mri_available=input_data.mri_available,
        pet_available=input_data.pet_available
    )

    # 4. Run Grouped XAI (Owen-value Inspired)
    xai_res = grouped_explainer.explain(
        features=features,
        dynamic_weights=fusion_res["dynamic_weights"],
        trajectory_stage=fusion_res["trajectory_stage"],
        region_attentions=fusion_res["region_attentions"]
    )

    # 5. Run AI Triage Engine
    triage_res = triage_engine.evaluate(
        trajectory_stage=fusion_res["trajectory_stage"],
        confidence=fusion_res["confidence"],
        uncertainty_score=fusion_res["uncertainty_score"],
        modalities={
            "clinical": input_data.clinical_available,
            "mri": input_data.mri_available,
            "pet": input_data.pet_available
        },
        features=features
    )

    # 6. Save Assessment Record to DB
    assessment = Assessment(
        patient_id=patient.id,
        assessment_date=datetime.utcnow(),
        mmse=input_data.mmse,
        cdrsb=input_data.cdrsb,
        adas_cog13=input_data.adas_cog13,
        memory_score=input_data.memory_score,
        executive_func=input_data.executive_func,
        language_score=input_data.language_score,
        faq_score=input_data.faq_score,
        clinical_available=input_data.clinical_available,
        mri_available=input_data.mri_available,
        pet_available=input_data.pet_available,
        mri_path=input_data.mri_file_id,
        pet_path=input_data.pet_file_id
    )
    db.add(assessment)
    db.flush()

    # Save Prediction Result
    prediction_record = PredictionResult(
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
    db.add(prediction_record)

    # Save Grouped Explanation
    explanation_record = GroupedExplanation(
        assessment_id=assessment.id,
        cognitive_contrib=xai_res["cognitive_contrib"],
        imaging_contrib=xai_res["imaging_contrib"],
        demographic_contrib=xai_res["demographic_contrib"],
        genetic_contrib=xai_res["genetic_contrib"],
        functional_contrib=xai_res["functional_contrib"],
        detailed_features=xai_res["detailed_features"],
        imaging_regions=xai_res["imaging_regions"]
    )
    db.add(explanation_record)

    # Save Triage Result
    triage_record = TriageResult(
        assessment_id=assessment.id,
        triage_status=triage_res["status"],
        triage_title=triage_res["title"],
        recommendation=triage_res["recommendation"],
        rationale=triage_res["rationale"],
        suggested_actions=triage_res["suggested_actions"]
    )
    db.add(triage_record)

    db.commit()
    db.refresh(assessment)

    return _format_assessment_response(assessment)

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return _format_assessment_response(assessment)

@router.get("", response_model=List[AssessmentResponse])
@router.get("/", response_model=List[AssessmentResponse])
@router.get("s", response_model=List[AssessmentResponse])
@router.get("s/", response_model=List[AssessmentResponse])
def list_assessments(
    skip: int = 0,
    limit: int = 50,
    stage: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Assessment).order_by(Assessment.id.desc())
    assessments = query.offset(skip).limit(limit).all()
    results = [_format_assessment_response(a) for a in assessments]
    if stage:
        results = [r for r in results if r["trajectory_stage"].lower() == stage.lower()]
    if risk:
        results = [r for r in results if r["risk_level"].lower() == risk.lower()]
    return results
