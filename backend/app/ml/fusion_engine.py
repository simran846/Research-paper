from typing import Dict, Any, Tuple
import numpy as np
from app.ml.dynamic_weighting import weighting_engine
from app.ml.clinical_model import clinical_model
from app.ml.imaging_model import imaging_model

class MultimodalFusionEngine:
    """
    Multimodal Fusion Engine.
    Fuses clinical tabular representations with spatial neuroimaging representations
    via dynamic modality weighting alpha.
    """

    STAGES = ["Normal Aging", "Early MCI", "Late MCI", "Alzheimer's Disease"]
    RISK_LEVELS = ["Low", "Moderate", "High", "Severe"]

    def fuse(
        self,
        features: Dict[str, Any],
        clinical_available: bool = True,
        mri_available: bool = False,
        pet_available: bool = False,
        mri_path: str = None,
        pet_path: str = None
    ) -> Dict[str, Any]:
        # 1. Evaluate Tabular Branch
        clin_probs, clin_latent = clinical_model.predict_probabilities(features)

        # 2. Evaluate Imaging Branch
        img_probs, region_attn, img_latent = imaging_model.extract_imaging_features(
            mri_available=mri_available,
            pet_available=pet_available,
            clinical_hint_score=clin_latent,
            mri_file_path=mri_path,
            pet_file_path=pet_path
        )

        # 3. Compute Dynamic Modality Weights
        cog_hint = clin_latent / 3.0
        weights, uncertainty_penalty = weighting_engine.compute_weights(
            clinical_available=clinical_available,
            mri_available=mri_available,
            pet_available=pet_available,
            cognitive_impairment_hint=cog_hint
        )

        # 4. Ensemble Fusion
        fused_probs = {}
        for stage in self.STAGES:
            p_clin = clin_probs.get(stage, 0.0)
            if img_probs is not None:
                p_img = img_probs.get(stage, 0.0)
                # Split imaging weight between MRI and PET
                img_total_weight = weights["mri"] + weights["pet"]
                fused_val = (weights["clinical"] * p_clin) + (img_total_weight * p_img)
            else:
                fused_val = p_clin
            fused_probs[stage] = fused_val

        # Normalize fused probs to sum to 1.0
        total_p = sum(fused_probs.values())
        if total_p > 0:
            fused_probs = {k: round(v / total_p, 4) for k, v in fused_probs.items()}

        # 5. Determine Top Stage & Risk
        top_stage = max(fused_probs.items(), key=lambda x: x[1])[0]
        raw_confidence = fused_probs[top_stage]

        # Uncertainty quantification: 1 - confidence + modality penalty
        total_uncertainty = round(float(np.clip((1.0 - raw_confidence) * 0.7 + uncertainty_penalty, 0.05, 0.85)), 3)
        calibrated_confidence = round(1.0 - total_uncertainty, 3)

        # Risk level determination based on predicted stage
        if top_stage == "Normal Aging":
            risk_level = "Low"
        elif top_stage == "Early MCI":
            risk_level = "Moderate"
        elif top_stage == "Late MCI":
            risk_level = "High"
        else:
            risk_level = "Severe"

        return {
            "trajectory_stage": top_stage,
            "confidence": calibrated_confidence,
            "uncertainty_score": total_uncertainty,
            "risk_level": risk_level,
            "stage_probabilities": fused_probs,
            "dynamic_weights": weights,
            "clinical_probs": clin_probs,
            "imaging_probs": img_probs,
            "region_attentions": region_attn,
            "clinical_score_normalized": clin_latent,
            "imaging_score_normalized": img_latent
        }

fusion_engine = MultimodalFusionEngine()
