import pytest
from app.ml.fusion_engine import MultimodalFusionEngine
from app.ml.grouped_xai import GroupedXAIExplainer
from app.ml.triage_engine import AITriageEngine

def test_multimodal_fusion_stages():
    engine = MultimodalFusionEngine()
    features_healthy = {
        "age": 65, "sex": "Female", "education_years": 16, "apoe4_allele_count": 0,
        "mmse": 29.5, "cdrsb": 0.0, "adas_cog13": 5.0, "memory_score": 1.2,
        "executive_func": 1.0, "language_score": 0.9, "faq_score": 0.0
    }
    res_healthy = engine.fuse(features_healthy, clinical_available=True, mri_available=False, pet_available=False)
    assert res_healthy["trajectory_stage"] == "Normal Aging"
    assert res_healthy["risk_level"] == "Low"

    features_ad = {
        "age": 78, "sex": "Male", "education_years": 12, "apoe4_allele_count": 2,
        "mmse": 15.0, "cdrsb": 8.0, "adas_cog13": 45.0, "memory_score": -2.8,
        "executive_func": -2.2, "language_score": -1.9, "faq_score": 18.0
    }
    res_ad = engine.fuse(features_ad, clinical_available=True, mri_available=True, pet_available=True)
    assert res_ad["trajectory_stage"] in ["Late MCI", "Alzheimer's Disease"]
    assert res_ad["risk_level"] in ["High", "Severe"]

def test_grouped_xai_sum_to_100():
    explainer = GroupedXAIExplainer()
    features = {
        "age": 72, "sex": "Male", "education_years": 14, "apoe4_allele_count": 1,
        "mmse": 23.0, "cdrsb": 2.5, "adas_cog13": 18.0, "memory_score": -0.8,
        "executive_func": -0.5, "language_score": -0.3, "faq_score": 4.0
    }
    weights = {"clinical": 0.40, "mri": 0.35, "pet": 0.25}
    res = explainer.explain(features, weights, "Early MCI", {"hippocampus": 0.6, "cortical_mantle": 0.4, "ventricles": 0.2})
    
    total = (
        res["cognitive_contrib"] +
        res["imaging_contrib"] +
        res["demographic_contrib"] +
        res["genetic_contrib"] +
        res["functional_contrib"]
    )
    assert abs(total - 100.0) < 0.2

def test_triage_missing_imaging_recommendation():
    triage = AITriageEngine()
    features = {"mmse": 23.0, "cdrsb": 2.5, "faq_score": 3.0}
    res = triage.evaluate(
        trajectory_stage="Early MCI",
        confidence=0.78,
        uncertainty_score=0.22,
        modalities={"clinical": True, "mri": False, "pet": False},
        features=features
    )
    assert res["status"] == "RECOMMEND_IMAGING_CONFIRMATION"
    assert "imaging" in res["title"].lower() or "mri" in res["recommendation"].lower()
