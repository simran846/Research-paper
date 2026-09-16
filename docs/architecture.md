# NeuroTriage AI: System Architecture

NeuroTriage AI provides an explainable multimodal framework for Alzheimer's disease risk stratification and clinical triage.

```
                                  +-----------------------------+
                                  |    Next.js + TS Frontend    |
                                  | (Dashboard, Assessment, XAI,|
                                  | Ablation, Analytics, Agent) |
                                  +--------------+--------------+
                                                 | REST API
                                                 v
                                  +-----------------------------+
                                  |       FastAPI Backend       |
                                  +--------------+--------------+
                                                 |
         +---------------------------------------+---------------------------------------+
         |                                       |                                       |
         v                                       v                                       v
+------------------+                   +--------------------+                  +--------------------+
| Clinical Branch  |                   |  Imaging Branch    |                  | Dynamic Weighting  |
| (Demographics,   |                   | (MRI / PET 3D CNN  |                  | & Fusion Engine    |
| Cognitive, APOE) |                   | Feature Extractor) |                  | (Adaptive Alpha)   |
+--------+---------+                   +---------+----------+                  +---------+----------+
         |                                       |                                       |
         +---------------------------------------+---------------------------------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |      4-Stage Ensemble       |
                                  |  (Normal, Early/Late MCI,   |
                                  |      Alzheimer's AD)        |
                                  +--------------+--------------+
                                                 |
                         +-----------------------+-----------------------+
                         |                                               |
                         v                                               v
              +--------------------+                           +--------------------+
              |    Grouped XAI     |                           |    Triage Engine   |
              | (Owen-value style  |                           | (Confidence/Risk   |
              | Cognitive/Demog/   |                           | & Recommendation)  |
              | Genetic/Imaging)   |                           +--------------------+
              +--------------------+
```

## Key Core Modules

### 1. Dynamic Modality Weighting Engine
- Handles missing modalities $m \in \{0, 1\}^M$ dynamically on-the-fly.
- When MRI or PET is unavailable, weights adapt ($\alpha_{\text{clinical}} \rightarrow 1.0$) rather than using naive zero-imputation or synthetic hallucinations.
- Automatically computes epistemic uncertainty penalties to inform downstream triage recommendations.

### 2. Grouped Explainable AI (Owen-Value Style)
- Solves collinearity noise across correlated cognitive tests (MMSE, CDR-SB, ADAS-Cog13, Memory Z-scores).
- Partitions features into 5 clinically grounded domains:
  1. Cognitive Function
  2. Neuroimaging Biomarkers
  3. Demographics & Cognitive Reserve
  4. Genetic Risk (APOE-ε4)
  5. Functional Impairment (FAQ)
- Guarantees attributions sum strictly to 100.0%.

### 3. AI Triage Layer
- Combines predicted trajectory stage with calibrated model uncertainty.
- In borderline MCI cases where imaging is missing, transparently generates recommendations to consider selective neuroimaging.
