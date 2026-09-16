# NeuroTriage AI: Research Methodology

## Theoretical Foundation

NeuroTriage AI is engineered to address four major gaps in existing multimodal machine learning for Alzheimer's disease:

1. **Collinear Explanations (SHAP limitation):** Standard Shapley values assume feature independence or distribute credit arbitrarily across correlated cognitive scores (MMSE, CDR-SB, ADAS-Cog). NeuroTriage AI utilizes **Owen-value-inspired Grouped XAI** to aggregate features into five biologically grounded coalitions.

2. **Missing Modality Fragility:** Instead of failing or imputing non-existent imaging scans with mean/zero replacement, the **Dynamic Modality Weighting Engine** recalculates fusion weights $\alpha_m$ dynamically and scales epistemic uncertainty.

3. **Multimodal Synergy:** Fuses tabular cognitive trajectories with spatial neuroimaging region attributions (Hippocampus, Cortical mantle, Ventricles).

4. **Selective AI Triage:** Triage decision boundaries evaluate model confidence to recommend additional imaging only when uncertainty is elevated.

## 4-Stage Diagnostic Trajectory Model
- **Stage 0 — Normal Aging:** Intact cognitive reserve, stable MMSE (28-30), CDR-SB 0.0.
- **Stage 1 — Early MCI:** Subtle episodic memory attenuation, preserved daily functioning.
- **Stage 2 — Late MCI:** Multi-domain cognitive deficit, elevated ADAS-Cog13, structural hippocampal volume reduction.
- **Stage 3 — Alzheimer's Disease:** Manifest dementia continuum with multi-domain impairment and functional autonomy loss.
