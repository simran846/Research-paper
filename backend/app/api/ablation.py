from fastapi import APIRouter
from app.schemas.analytics import AblationRequest, AblationResponse
from app.ml.dynamic_weighting import weighting_engine

router = APIRouter(prefix="/ablation", tags=["Ablation Study"])

@router.post("/run", response_model=AblationResponse)
def run_ablation_study(req: AblationRequest):
    """
    Simulates architecture performance changes when modalities or algorithmic components are ablated.
    """
    # Baseline Full Model
    base_acc = 0.914
    base_f1 = 0.898
    base_sens = 0.895
    base_spec = 0.928
    base_prec = 0.902
    base_auroc = 0.952
    
    macro_f1_drop = 0.0
    uncertainty_increase = 0.0
    degradation_notes = []

    # Calculate impact of component ablations
    if not req.enable_pet:
        macro_f1_drop += 0.038
        uncertainty_increase += 0.06
        degradation_notes.append("PET Disabled: -3.8% F1 (metabolic sensitivity loss in prodromal stages)")

    if not req.enable_mri:
        macro_f1_drop += 0.045
        uncertainty_increase += 0.08
        degradation_notes.append("MRI Disabled: -4.5% F1 (hippocampal structural boundary loss)")

    if not req.enable_clinical:
        macro_f1_drop += 0.082
        uncertainty_increase += 0.14
        degradation_notes.append("Clinical Disabled: -8.2% F1 (functional & cognitive anchor loss)")

    if not req.enable_dynamic_weighting:
        macro_f1_drop += 0.065
        uncertainty_increase += 0.12
        degradation_notes.append("Dynamic Weighting Disabled: -6.5% F1 (missing-modality collapse under fixed weights)")

    if not req.enable_grouped_xai:
        macro_f1_drop += 0.015
        degradation_notes.append("Grouped XAI Disabled: Granular feature collinearity noise in clinical explanations")

    # Current simulated metrics
    cur_f1 = round(max(0.50, base_f1 - macro_f1_drop), 3)
    cur_acc = round(max(0.55, base_acc - macro_f1_drop * 0.9), 3)
    cur_auroc = round(max(0.60, base_auroc - macro_f1_drop * 1.1), 3)
    cur_sens = round(max(0.50, base_sens - macro_f1_drop * 0.85), 3)
    cur_spec = round(max(0.50, base_spec - macro_f1_drop * 0.80), 3)
    cur_prec = round(max(0.50, base_prec - macro_f1_drop * 0.85), 3)

    weights, _ = weighting_engine.compute_weights(
        clinical_available=req.enable_clinical,
        mri_available=req.enable_mri,
        pet_available=req.enable_pet
    )

    config_name = "Full Proposed NeuroTriage Model"
    if not all([req.enable_mri, req.enable_pet, req.enable_clinical, req.enable_dynamic_weighting, req.enable_grouped_xai]):
        disabled = []
        if not req.enable_clinical: disabled.append("No Clinical")
        if not req.enable_mri: disabled.append("No MRI")
        if not req.enable_pet: disabled.append("No PET")
        if not req.enable_dynamic_weighting: disabled.append("Fixed Weights")
        if not req.enable_grouped_xai: disabled.append("Raw SHAP")
        config_name = f"Ablated ({', '.join(disabled)})"

    return {
        "config_name": config_name,
        "metrics": {
            "accuracy": cur_acc,
            "sensitivity": cur_sens,
            "specificity": cur_spec,
            "precision": cur_prec,
            "f1_score": cur_f1,
            "auroc": cur_auroc
        },
        "macro_f1_drop": round(macro_f1_drop * 100, 1),
        "uncertainty_increase": round(uncertainty_increase * 100, 1),
        "missing_modality_degradation": " | ".join(degradation_notes) if degradation_notes else "Optimal performance with all multimodal & explainability modules active.",
        "weights_preview": weights
    }
