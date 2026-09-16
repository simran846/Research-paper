# Model Checkpoints & Pretrained Weights

This directory hosts PyTorch and XGBoost model weights for NeuroTriage AI.

## Modular Swappability
The codebase is architected with strict boundary separation in `backend/app/ml/`:
- `clinical_model.py`: Implements tabular XGBoost / TabNet inference.
- `imaging_model.py`: Implements 3D CNN / spatial ROI extraction.
- `dynamic_weighting.py`: Implements adaptive $\alpha$-recalculation.
- `fusion_engine.py`: Fuses multi-branch representations.
- `grouped_xai.py`: Implements Owen-value coalition game theory attribution.
- `triage_engine.py`: Computes calibrated risk triage recommendations.

To substitute pre-trained weights, place your `.pt` or `.json` checkpoint files here and reference them in `backend/app/core/config.py`.
