# NeuroTriage AI: REST API Documentation

Base URL: `http://localhost:8000/api`

## Core Endpoints

### 1. Patients
- `POST /api/patients/`: Create or retrieve a patient record.
- `GET /api/patients/`: List all patients with optional search query.
- `GET /api/patients/{id}`: Retrieve a single patient.

### 2. Assessments & Inference
- `POST /api/assessment/`: Execute full multimodal pipeline (clinical, imaging, dynamic weighting, fusion, grouped XAI, triage).
- `GET /api/assessment/{id}`: Retrieve a completed assessment by ID.
- `GET /api/assessments/`: List recent assessments with stage/risk filters.
- `POST /api/predict`: Stateless endpoint for quick stage inference.
- `POST /api/explain`: Stateless endpoint for Grouped XAI attributions.
- `POST /api/triage`: Stateless endpoint for triage recommendation evaluation.
- `POST /api/fusion`: Stateless multimodal fusion preview.

### 3. Neuroimaging Uploads
- `POST /api/upload/mri`: Multipart upload for structural MRI volumes (.nii, .nii.gz, .png, .jpg).
- `POST /api/upload/pet`: Multipart upload for metabolic PET volumes (.nii, .nii.gz, .png, .jpg).

### 4. Analytics & Ablation
- `GET /api/analytics/`: Retrieve model performance metrics and baseline comparisons (SVM, TabNet, GCN, NeuroTriage).
- `POST /api/ablation/run`: Run dynamic component ablation experiment.

### 5. Research AI Assistant & Reports
- `POST /api/agent/chat`: Interact with the context-aware NeuroTriage Assistant.
- `GET /api/report/{id}`: Generate and download a clinical decision-support PDF research report.
