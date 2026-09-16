import pytest
from app.ml.dynamic_weighting import DynamicModalityWeightingEngine

def test_all_modalities_available():
    engine = DynamicModalityWeightingEngine()
    weights, unc = engine.compute_weights(clinical_available=True, mri_available=True, pet_available=True)
    assert abs(sum(weights.values()) - 1.0) < 1e-3
    assert weights["clinical"] > 0
    assert weights["mri"] > 0
    assert weights["pet"] > 0
    assert unc < 0.05 # Low uncertainty

def test_missing_imaging_only_clinical():
    engine = DynamicModalityWeightingEngine()
    weights, unc = engine.compute_weights(clinical_available=True, mri_available=False, pet_available=False)
    assert weights["clinical"] == 1.0
    assert weights["mri"] == 0.0
    assert weights["pet"] == 0.0
    assert unc > 0.10 # Uncertainty penalty for missing imaging

def test_missing_pet_only_mri_clinical():
    engine = DynamicModalityWeightingEngine()
    weights, unc = engine.compute_weights(clinical_available=True, mri_available=True, pet_available=False)
    assert abs(sum(weights.values()) - 1.0) < 1e-3
    assert weights["pet"] == 0.0
    assert weights["clinical"] > 0.4
    assert weights["mri"] > 0.3
