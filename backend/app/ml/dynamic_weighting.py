from typing import Dict, Tuple

class DynamicModalityWeightingEngine:
    """
    Dynamic Modality Weighting Engine.
    
    Solves the literature gap where multimodal architectures fail or require
    unrealistic zero/mean imputation when expensive neuroimaging modalities
    (MRI/PET) are unavailable in routine clinical workflows.
    
    Instead of synthesizing artificial imaging or crashing, this engine:
    1. Detects available modalities m in {0, 1}^M
    2. Recalculates normalized fusion weights alpha_i dynamically
    3. Quantifies epistemic uncertainty penalty delta_u due to missing modalities
    """

    def __init__(self, base_clinical: float = 0.40, base_mri: float = 0.35, base_pet: float = 0.25):
        self.base_clinical = base_clinical
        self.base_mri = base_mri
        self.base_pet = base_pet

    def compute_weights(
        self,
        clinical_available: bool = True,
        mri_available: bool = False,
        pet_available: bool = False,
        cognitive_impairment_hint: float = 0.5 # 0.0 (normal) to 1.0 (severe)
    ) -> Tuple[Dict[str, float], float]:
        """
        Returns (weights_dict, uncertainty_penalty)
        """
        raw_weights = {}
        
        # Clinical tabular data is base anchor
        if clinical_available:
            raw_weights["clinical"] = self.base_clinical
        else:
            raw_weights["clinical"] = 0.0

        if mri_available:
            # MRI is especially discriminative in intermediate/structural stages
            raw_weights["mri"] = self.base_mri
        else:
            raw_weights["mri"] = 0.0

        if pet_available:
            # PET (FDG / Amyloid) gives high sensitivity in metabolic shifts
            raw_weights["pet"] = self.base_pet
        else:
            raw_weights["pet"] = 0.0

        total = sum(raw_weights.values())
        
        # Fallback if somehow nothing is flagged as available
        if total <= 1e-6:
            return {"clinical": 1.0, "mri": 0.0, "pet": 0.0}, 0.50

        # Dynamic Normalization: sum(alpha_i) = 1.0
        normalized_weights = {k: round(v / total, 4) for k, v in raw_weights.items()}

        # Uncertainty penalty calculation
        # Having only clinical data incurs a moderate uncertainty penalty (0.15)
        # Having clinical + MRI incurs small penalty (0.05)
        # Having full multimodal clinical + MRI + PET yields lowest uncertainty (0.0)
        missing_count = (1 - int(clinical_available)) + (1 - int(mri_available)) + (1 - int(pet_available))
        
        if missing_count == 0:
            uncertainty_penalty = 0.02
        elif missing_count == 1:
            uncertainty_penalty = 0.07 if not pet_available else 0.10
        elif missing_count == 2:
            uncertainty_penalty = 0.16 # clinical only
        else:
            uncertainty_penalty = 0.40

        return normalized_weights, uncertainty_penalty

weighting_engine = DynamicModalityWeightingEngine()
