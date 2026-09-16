from fastapi import APIRouter
from typing import Dict, Any
from app.schemas.assessment import AssessmentInput
from app.ml.fusion_engine import fusion_engine
from app.ml.grouped_xai import grouped_explainer
from app.ml.triage_engine import triage_engine

router = APIRouter(tags=["Inference & Prediction"])

@router.post("/predict")
def predict_endpoint(data: AssessmentInput) -> Dict[str, Any]:
    features = {
        "age": data.age,
        "sex": data.sex,
        "education_years": data.education_years,
        "apoe4_allele_count": data.apoe4_allele_count,
        "mmse": data.mmse,
        "cdrsb": data.cdrsb,
        "adas_cog13": data.adas_cog13,
        "memory_score": data.memory_score,
        "executive_func": data.executive_func,
        "language_score": data.language_score,
        "faq_score": data.faq_score
    }
    fusion_res = fusion_engine.fuse(
        features=features,
        clinical_available=data.clinical_available,
        mri_available=data.mri_available,
        pet_available=data.pet_available
    )
    return {
        "stage": fusion_res["trajectory_stage"],
        "confidence": fusion_res["confidence"],
        "uncertainty_score": fusion_res["uncertainty_score"],
        "risk_level": fusion_res["risk_level"],
        "stage_probabilities": fusion_res["stage_probabilities"],
        "modalities": {
            "clinical": data.clinical_available,
            "mri": data.mri_available,
            "pet": data.pet_available
        },
        "dynamic_weights": fusion_res["dynamic_weights"],
        "demo_mode": True
    }

@router.post("/fusion")
def fusion_endpoint(data: AssessmentInput) -> Dict[str, Any]:
    return predict_endpoint(data)

@router.post("/explain")
def explain_endpoint(data: AssessmentInput) -> Dict[str, Any]:
    features = {
        "age": data.age,
        "sex": data.sex,
        "education_years": data.education_years,
        "apoe4_allele_count": data.apoe4_allele_count,
        "mmse": data.mmse,
        "cdrsb": data.cdrsb,
        "adas_cog13": data.adas_cog13,
        "memory_score": data.memory_score,
        "executive_func": data.executive_func,
        "language_score": data.language_score,
        "faq_score": data.faq_score
    }
    fusion_res = fusion_engine.fuse(
        features=features,
        clinical_available=data.clinical_available,
        mri_available=data.mri_available,
        pet_available=data.pet_available
    )
    xai_res = grouped_explainer.explain(
        features=features,
        dynamic_weights=fusion_res["dynamic_weights"],
        trajectory_stage=fusion_res["trajectory_stage"],
        region_attentions=fusion_res["region_attentions"]
    )
    return {
        "grouped_attributions": xai_res,
        "dynamic_weights": fusion_res["dynamic_weights"],
        "demo_mode": True
    }

@router.post("/triage")
def triage_endpoint(data: AssessmentInput) -> Dict[str, Any]:
    features = {
        "age": data.age,
        "sex": data.sex,
        "education_years": data.education_years,
        "apoe4_allele_count": data.apoe4_allele_count,
        "mmse": data.mmse,
        "cdrsb": data.cdrsb,
        "adas_cog13": data.adas_cog13,
        "memory_score": data.memory_score,
        "executive_func": data.executive_func,
        "language_score": data.language_score,
        "faq_score": data.faq_score
    }
    fusion_res = fusion_engine.fuse(
        features=features,
        clinical_available=data.clinical_available,
        mri_available=data.mri_available,
        pet_available=data.pet_available
    )
    triage_res = triage_engine.evaluate(
        trajectory_stage=fusion_res["trajectory_stage"],
        confidence=fusion_res["confidence"],
        uncertainty_score=fusion_res["uncertainty_score"],
        modalities={
            "clinical": data.clinical_available,
            "mri": data.mri_available,
            "pet": data.pet_available
        },
        features=features
    )
    return {
        "triage": triage_res,
        "confidence": fusion_res["confidence"],
        "uncertainty_score": fusion_res["uncertainty_score"],
        "stage": fusion_res["trajectory_stage"],
        "demo_mode": True
    }
