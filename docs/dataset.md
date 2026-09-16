# Dataset & Integration Guide

## Synthetic Cohort
Due to patient privacy and ADNI data-use agreements, this repository includes a mathematically grounded **Synthetic Cohort (150+ records)** in:
- `data/synthetic/synthetic_patients.json`
- `data/synthetic/synthetic_adni_cohort.csv`

The synthetic data accurately reflects published cross-sectional distributions across cognitive batteries (MMSE, CDR-SB, ADAS-Cog13), biological demographics, APOE genotypes, and imaging availability.

## Connecting Real ADNI Datasets
1. Submit a Data Access Application at [ADNI LONI](https://adni.loni.usc.edu/).
2. Once authorized, download `ADNIMERGE.csv`.
3. Preprocess 3D T1w MRI scans using standard FreeSurfer or FastSurfer pipelines.
4. Set environment variable `DEMO_MODE=False` in `.env` to engage live tensor inference.
