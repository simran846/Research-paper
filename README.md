# NeuroTriage AI: Explainable Multimodal AI for Alzheimer's Risk Stratification

> **ACADEMIC RESEARCH & CLINICAL DECISION-SUPPORT PROTOTYPE**  
> *Disclaimer: NeuroTriage AI is an experimental clinical decision-support and research demonstration platform. It does NOT provide medical diagnoses, treatment plans, or prescription recommendations. All outputs must be reviewed by qualified medical professionals.*

---

## 1. Project Overview & Problem Statement

Early stratification of patients along the Alzheimer's disease continuum is essential for clinical trial cohort selection and timely intervention. However, existing AI/ML pipelines face four fundamental literature gaps:

1. **Collinear Feature Noise in XAI:** Standard SHAP attributions become noisy and unstable when applied across collinear cognitive tests (MMSE, CDR-SB, ADAS-Cog).
2. **Fragility to Missing Imaging:** Conventional multimodal networks fail or rely on flawed zero-imputation when high-cost structural MRI or FDG-PET scans are unavailable.
3. **Single-Modality Blindness:** Unimodal models remain blind to either longitudinal cognitive dynamics or early localized hippocampal atrophy.
4. **Indiscriminate Baseline Scan Ordering:** Neuroimaging is often ordered indiscriminately rather than selectively recommended based on model uncertainty.

**NeuroTriage AI** resolves these challenges using:
- **Owen-Value Grouped XAI:** Partitions 14+ variables into 5 clinically grounded domains (Cognitive, Imaging, Demographics, Genetics, Functional) summing strictly to 100%.
- **Dynamic Modality Weighting:** Adaptively recalculates fusion weights on-the-fly when MRI/PET scans are missing.
- **Multimodal Dual-Branch Ensemble:** Fuses spatial 3D CNN embeddings with XGBoost/TabNet tabular representations.
- **Uncertainty-Grounded AI Triage:** Transparently flags low-confidence assessments and selectively recommends targeted imaging confirmation.
- **4-Stage Trajectory:** *Normal Aging* $\rightarrow$ *Early MCI* $\rightarrow$ *Late MCI* $\rightarrow$ *Alzheimer's Disease*.

---

## 2. Technology Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Backend:** Python 3.13 / FastAPI, Pydantic V2, SQLAlchemy, ReportLab (PDF Generation).
- **ML / XAI:** PyTorch, scikit-learn, XGBoost, Owen-value coalition game theory attribution.
- **Database:** SQLite (default for zero-setup local execution) / PostgreSQL-ready.
- **Containerization:** Docker & Docker Compose.

---

## 3. System Architecture

```
                 USER / CLINICIAN
                        |
                        v
                 NEXT.JS FRONTEND (TypeScript, Tailwind, Recharts)
                        |
                        v
                  FASTAPI BACKEND (Python 3.13, PyTorch/XGBoost)
                        |
          +-------------+-------------+
          |                           |
          v                           v
   IMAGING PIPELINE            CLINICAL PIPELINE
          |                           |
      MRI / PET                  Tabular Cognition (MMSE, CDR-SB, APOE)
          |                           |
   3D CNN Features             XGBoost Latent Embedding
          +-------------+-------------+
                        |
                        v
              DYNAMIC WEIGHTING ENGINE (Adaptive alpha-recalculation)
                        |
                        v
                  FUSION ENGINE (Ensemble Softmax)
                        |
          +-------------+-------------+
          |                           |
          v                           v
     PREDICTION                  GROUPED XAI (Owen-Value 5-Domain)
          |                           |
   Diagnostic Stage              Attribution Summary
          +-------------+-------------+
                        |
                        v
                  AI TRIAGE LAYER (Uncertainty-Grounded Clinical Decision Support)
                        |
                        v
              DOWNLOADABLE RESEARCH REPORT (PDF)
```

---

## 4. Quick Start (Launch with ONE Command)

NeuroTriage AI includes a unified launcher so you never need to juggle separate terminals. Running one command starts both the FastAPI backend (port 8000) and Next.js frontend (port 3000), connecting them through internal reverse-proxy rewrites.

### Method 1: Using npm (Recommended)
```bash
# 1. Install all dependencies (Root, Frontend, & Backend)
npm run install:all

# 2. Start EVERYTHING with ONE command
npm run dev
```

### Method 2: Using Python Launcher
```bash
# Run the cross-platform unified runner
python run.py
```

### Method 3: Using Docker Compose
```bash
docker-compose up --build
```

---

## 5. Using the Application

Once launched, simply open:
👉 **`http://localhost:3000`**

The web application automatically handles all API communication with the backend. You do not need to open port 8000 separately (unless you wish to inspect the interactive Swagger docs at `http://localhost:8000/docs`).

---

## 6. End-to-End Demo Workflow

1. **Open Landing Page (`/`):** Review literature gaps, 4-stage trajectory continuum, and architectural overview.
2. **Access Clinician Dashboard (`/dashboard`):** View real-time cohort trajectory distributions, risk stratification donuts, and recent patient records.
3. **Run Assessment Flow 1 (Missing Neuroimaging):**
   - Click **New Assessment (`/assessment/new`)** $\rightarrow$ Fill demographics (Age: 72, APOE: Positive), Cognitive (MMSE: 23.5, CDR-SB: 2.5, ADAS-Cog: 18.0).
   - In Step 3, leave MRI & PET **Not Available (Missing)**.
   - Click **Run NeuroTriage Assessment**.
   - **Observe:** Dynamic weighting adapts to allocate **100% weight to Tabular Clinical**, predicts **Early MCI**, and the Triage Engine recommends considering targeted neuroimaging to reduce uncertainty.
4. **Run Assessment Flow 2 (Full Multimodal Available):**
   - Click **New Assessment** $\rightarrow$ Select preset *"Case 2: Late MCI (Full Multimodal)"*.
   - **Observe:** Weights balance across Clinical (40%), MRI (35%), and PET (25%). Brain Attention Viewer displays hippocampal saliency overlays, and uncertainty decreases.
5. **Inspect Explainable AI (`/explainability`):** Explore the 5 Owen-value feature domains.
6. **Execute Ablation Study (`/ablation`):** Toggle MRI, PET, Dynamic Weighting, and Grouped XAI to empirically observe Macro F1 drops and uncertainty inflation.
7. **Download Research PDF Report:** Click **Download Research PDF** on any result page.

---

## 7. ADNI Dataset Integration & Model Swapping

Refer to [docs/dataset.md](file:///docs/dataset.md) and [models/README.md](file:///models/README.md) for detailed instructions on connecting authorized ADNI NIfTI volumes and substituting pre-trained PyTorch weights.

---

## 8. Ethical Considerations & Limitations

- **Simulated Demonstration Mode:** Default mode provides deterministic, scientifically grounded prototype inference for demonstration without requiring restricted clinical credentials or expensive GPU clusters.
- **Demographic Generalizability:** Clinical cognitive cutoffs must be calibrated to local target populations and language-specific neuropsychological batteries.
- **Physician Oversight:** Predictions are intended solely to assist clinical trial eligibility screening and research workflows.
