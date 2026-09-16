from pydantic import BaseModel
from typing import Dict, List, Any

class ModelMetrics(BaseModel):
    accuracy: float
    sensitivity: float
    specificity: float
    precision: float
    f1_score: float
    auroc: float

class BaselineComparison(BaseModel):
    model_name: str
    modality_support: str
    accuracy: float
    f1_score: float
    auroc: float
    missing_modality_robustness: str
    explainability_type: str

class AnalyticsResponse(BaseModel):
    demo_mode: bool
    status_message: str
    active_ensemble_metrics: ModelMetrics
    baseline_comparisons: List[BaselineComparison]
    confusion_matrix: List[List[int]]
    stage_labels: List[str]
    roc_curve_data: List[Dict[str, Any]]

class AblationRequest(BaseModel):
    enable_mri: bool = True
    enable_pet: bool = True
    enable_clinical: bool = True
    enable_dynamic_weighting: bool = True
    enable_grouped_xai: bool = True

class AblationResponse(BaseModel):
    config_name: str
    metrics: ModelMetrics
    macro_f1_drop: float
    uncertainty_increase: float
    missing_modality_degradation: str
    weights_preview: Dict[str, float]
