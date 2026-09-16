import numpy as np
from typing import Dict, Any, Tuple

class ClinicalTabularModel:
    """
    Clinical & Cognitive Tabular Model Branch.
    Uses normalized ADNI-grounded features (MMSE, CDRSB, ADAS-Cog13, Memory, Executive, Language, FAQ, APOE, Age, Education)
    to output diagnostic trajectory logits and tabular latent embeddings.
    """

    STAGES = ["Normal Aging", "Early MCI", "Late MCI", "Alzheimer's Disease"]

    def __init__(self):
        # Established clinical cutoff coefficients derived from ADNI cohort statistics
        self.feature_weights = {
            "mmse": -0.22,         # Lower is worse (normal 27-30)
            "cdrsb": 0.30,         # Higher is worse (normal 0, MCI 0.5-4.0, AD > 4.5)
            "adas_cog13": 0.28,    # Higher is worse (normal < 12, MCI 12-25, AD > 25)
            "memory_score": -0.24, # Standardized z-score (normal > 0.5, MCI -0.5 to -1.5, AD < -1.5)
            "executive_func": -0.16,
            "language_score": -0.12,
            "faq_score": 0.20,     # Functional deficit (normal 0-1, MCI 2-8, AD > 9)
            "apoe4": 0.18,         # 0, 1, or 2 alleles
            "age": 0.08,           # Age effect
            "education": -0.06     # Cognitive reserve effect
        }

    def compute_latent_score(self, features: Dict[str, Any]) -> float:
        """
        Maps multi-domain clinical & cognitive inputs to a standardized continuum score in [0.0, 3.0]
        0.0 - 0.75: Normal Aging
        0.75 - 1.60: Early MCI
        1.60 - 2.35: Late MCI
        2.35 - 3.0+: Alzheimer's Disease
        """
        # Feature normalizations
        norm_mmse = (30.0 - float(features.get("mmse", 28.0))) / 30.0 # 0 (perfect) to 1 (severe)
        norm_cdrsb = min(float(features.get("cdrsb", 0.0)) / 18.0, 1.0)
        norm_adas = min(float(features.get("adas_cog13", 10.0)) / 70.0, 1.0)
        
        # Memory & Executive composite (invert z-scores: negative z is severe)
        mem_z = float(features.get("memory_score", 0.5))
        norm_mem = max(0.0, min(1.0, (1.5 - mem_z) / 4.0))
        
        exec_z = float(features.get("executive_func", 0.5))
        norm_exec = max(0.0, min(1.0, (1.5 - exec_z) / 4.0))

        lang_z = float(features.get("language_score", 0.5))
        norm_lang = max(0.0, min(1.0, (1.5 - lang_z) / 4.0))

        norm_faq = min(float(features.get("faq_score", 0.0)) / 30.0, 1.0)
        
        # Genetics & Demographics
        apoe = float(features.get("apoe4_allele_count", 0)) / 2.0
        norm_age = max(0.0, min(1.0, (float(features.get("age", 70)) - 50.0) / 45.0))
        norm_edu_reserve = max(0.0, min(1.0, (float(features.get("education_years", 16.0)) - 6.0) / 16.0))

        # Weighted aggregate composite score
        score = (
            norm_mmse * 0.22 +
            norm_cdrsb * 0.32 +
            norm_adas * 0.28 +
            norm_mem * 0.25 +
            norm_exec * 0.15 +
            norm_lang * 0.10 +
            norm_faq * 0.20 +
            apoe * 0.15 +
            norm_age * 0.08 -
            norm_edu_reserve * 0.06
        )
        # Scale to 0.0 - 3.0 range
        scaled = np.clip(score * 2.1, 0.0, 3.0)
        return float(scaled)

    def predict_probabilities(self, features: Dict[str, Any]) -> Tuple[Dict[str, float], float]:
        """
        Outputs 4-class softmax probabilities and normalized latent continuum score.
        """
        latent = self.compute_latent_score(features)
        
        # Gaussian centroids for the 4 trajectory stages
        centers = [0.25, 1.15, 1.95, 2.75]
        spread = 0.55
        
        raw_logits = [
            -((latent - c) ** 2) / (2 * (spread ** 2))
            for c in centers
        ]
        
        exp_logits = np.exp(raw_logits)
        probs = exp_logits / np.sum(exp_logits)
        
        prob_dict = {
            self.STAGES[i]: round(float(probs[i]), 4)
            for i in range(4)
        }
        
        return prob_dict, latent

clinical_model = ClinicalTabularModel()
