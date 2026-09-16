import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_model_status_endpoint():
    res = client.get("/api/model/status")
    assert res.status_code == 200
    assert res.json()["model_status"] == "READY"

def test_analytics_endpoint():
    res = client.get("/api/analytics/")
    assert res.status_code == 200
    data = res.json()
    assert "active_ensemble_metrics" in data
    assert "baseline_comparisons" in data
    assert len(data["baseline_comparisons"]) >= 4

def test_ablation_endpoint():
    res = client.post("/api/ablation/run", json={
        "enable_mri": False,
        "enable_pet": False,
        "enable_clinical": True,
        "enable_dynamic_weighting": True,
        "enable_grouped_xai": True
    })
    assert res.status_code == 200
    data = res.json()
    assert data["macro_f1_drop"] > 0
    assert data["weights_preview"]["clinical"] == 1.0

def test_assessment_flow_and_report():
    # 1. Run Assessment
    payload = {
        "patient_id": "TEST-PT-001",
        "age": 72.0,
        "sex": "Male",
        "education_years": 16.0,
        "apoe4_allele_count": 1,
        "mmse": 22.0,
        "cdrsb": 3.5,
        "adas_cog13": 21.0,
        "memory_score": -1.2,
        "executive_func": -0.8,
        "language_score": -0.4,
        "faq_score": 6.0,
        "clinical_available": True,
        "mri_available": False,
        "pet_available": False
    }
    res = client.post("/api/assessment/", json=payload)
    assert res.status_code == 200
    assessment = res.json()
    assert assessment["patient_id"] == "TEST-PT-001"
    assert assessment["trajectory_stage"] in ["Early MCI", "Late MCI"]
    assert assessment["dynamic_weights"]["clinical"] == 1.0
    assessment_id = assessment["id"]

    # 2. Test Get Assessment
    res_get = client.get(f"/api/assessment/{assessment_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == assessment_id

    # 3. Test AI Agent
    chat_res = client.post("/api/agent/chat", json={
        "assessment_id": assessment_id,
        "message": "Why did the model classify this patient?"
    })
    assert chat_res.status_code == 200
    assert len(chat_res.json()["reply"]) > 20

    # 4. Test PDF Report Generation
    report_res = client.get(f"/api/report/{assessment_id}")
    assert report_res.status_code == 200
    assert report_res.headers["content-type"] == "application/pdf"
    assert len(report_res.content) > 1000
