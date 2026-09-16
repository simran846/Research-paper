from fastapi import APIRouter
from app.schemas.analytics import AnalyticsResponse, ModelMetrics, BaselineComparison

router = APIRouter(prefix="/analytics", tags=["Model Analytics"])

@router.get("/", response_model=AnalyticsResponse)
@router.get("", response_model=AnalyticsResponse)
def get_model_analytics():
    """
    Returns research performance metrics and benchmark baseline comparisons.
    Labeled as simulated research demo benchmark metrics.
    """
    return {
        "demo_mode": True,
        "status_message": "Research Prototype Evaluation Metrics (Simulated ADNI Cross-Validation Benchmark)",
        "active_ensemble_metrics": {
            "accuracy": 0.914,
            "sensitivity": 0.895,
            "specificity": 0.928,
            "precision": 0.902,
            "f1_score": 0.898,
            "auroc": 0.952
        },
        "baseline_comparisons": [
            {
                "model_name": "Standard SVM (Tabular Only)",
                "modality_support": "Clinical Tabular",
                "accuracy": 0.782,
                "f1_score": 0.764,
                "auroc": 0.812,
                "missing_modality_robustness": "N/A (Single Modality)",
                "explainability_type": "Linear feature weights (high collinearity noise)"
            },
            {
                "model_name": "TabNet (Clinical Tabular)",
                "modality_support": "Clinical Tabular",
                "accuracy": 0.826,
                "f1_score": 0.811,
                "auroc": 0.865,
                "missing_modality_robustness": "Poor without imputation",
                "explainability_type": "Sparse sequential attention masks"
            },
            {
                "model_name": "Spatial GCN (Brain Connectome)",
                "modality_support": "MRI / PET Only",
                "accuracy": 0.841,
                "f1_score": 0.830,
                "auroc": 0.887,
                "missing_modality_robustness": "Crashes on missing MRI/PET",
                "explainability_type": "GNN node saliency (opaque clinical mapping)"
            },
            {
                "model_name": "NeuroTriage Multimodal Ensemble (Proposed)",
                "modality_support": "Multimodal (Clinical + MRI + PET)",
                "accuracy": 0.914,
                "f1_score": 0.898,
                "auroc": 0.952,
                "missing_modality_robustness": "High (Adaptive Dynamic Modality Weighting)",
                "explainability_type": "Owen-value Grouped XAI (Clinically ground-truth aligned)"
            }
        ],
        "stage_labels": ["Normal Aging", "Early MCI", "Late MCI", "Alzheimer's Disease"],
        "confusion_matrix": [
            [44, 4, 1, 0],
            [3, 48, 5, 1],
            [0, 3, 27, 2],
            [0, 0, 2, 20]
        ],
        "roc_curve_data": [
            {"fpr": 0.0, "tpr": 0.0},
            {"fpr": 0.02, "tpr": 0.65},
            {"fpr": 0.05, "tpr": 0.84},
            {"fpr": 0.10, "tpr": 0.92},
            {"fpr": 0.20, "tpr": 0.96},
            {"fpr": 0.40, "tpr": 0.98},
            {"fpr": 1.0, "tpr": 1.0}
        ]
    }
