import random
import json
import csv
import os
from typing import List, Dict, Any

def generate_synthetic_cohort(count: int = 150) -> List[Dict[str, Any]]:
    """
    Generates realistic synthetic multi-modal patient records grounded in ADNI statistics.
    Labels clearly state these are synthetic demonstration records.
    """
    cohort = []
    stages = ["Normal Aging", "Early MCI", "Late MCI", "Alzheimer's Disease"]
    stage_weights = [0.30, 0.35, 0.20, 0.15]
    
    for i in range(1, count + 1):
        pid = f"ADNI-SYN-{1000 + i}"
        stage = random.choices(stages, weights=stage_weights)[0]
        
        sex = random.choice(["Male", "Female"])
        education = float(random.choice([12.0, 14.0, 16.0, 18.0, 20.0]))
        
        if stage == "Normal Aging":
            age = float(round(random.uniform(62, 82), 1))
            apoe = random.choices([0, 1, 2], weights=[0.75, 0.22, 0.03])[0]
            mmse = float(round(random.uniform(28.0, 30.0), 1))
            cdrsb = float(round(random.uniform(0.0, 0.5), 1))
            adas_cog = float(round(random.uniform(4.0, 11.0), 1))
            memory = float(round(random.uniform(0.3, 1.8), 2))
            executive = float(round(random.uniform(0.2, 1.6), 2))
            language = float(round(random.uniform(0.1, 1.5), 2))
            faq = float(round(random.uniform(0.0, 1.0), 1))
            mri_avail = random.random() < 0.60
            pet_avail = random.random() < 0.35

        elif stage == "Early MCI":
            age = float(round(random.uniform(66, 85), 1))
            apoe = random.choices([0, 1, 2], weights=[0.50, 0.40, 0.10])[0]
            mmse = float(round(random.uniform(24.0, 28.0), 1))
            cdrsb = float(round(random.uniform(0.5, 2.5), 1))
            adas_cog = float(round(random.uniform(12.0, 22.0), 1))
            memory = float(round(random.uniform(-1.2, 0.2), 2))
            executive = float(round(random.uniform(-0.8, 0.5), 2))
            language = float(round(random.uniform(-0.6, 0.7), 2))
            faq = float(round(random.uniform(1.0, 6.0), 1))
            mri_avail = random.random() < 0.70
            pet_avail = random.random() < 0.45

        elif stage == "Late MCI":
            age = float(round(random.uniform(69, 88), 1))
            apoe = random.choices([0, 1, 2], weights=[0.35, 0.50, 0.15])[0]
            mmse = float(round(random.uniform(20.0, 24.5), 1))
            cdrsb = float(round(random.uniform(2.5, 4.5), 1))
            adas_cog = float(round(random.uniform(20.0, 32.0), 1))
            memory = float(round(random.uniform(-2.2, -0.9), 2))
            executive = float(round(random.uniform(-1.8, -0.4), 2))
            language = float(round(random.uniform(-1.5, -0.2), 2))
            faq = float(round(random.uniform(5.0, 12.0), 1))
            mri_avail = random.random() < 0.75
            pet_avail = random.random() < 0.50

        else: # Alzheimer's Disease
            age = float(round(random.uniform(70, 92), 1))
            apoe = random.choices([0, 1, 2], weights=[0.20, 0.55, 0.25])[0]
            mmse = float(round(random.uniform(11.0, 20.0), 1))
            cdrsb = float(round(random.uniform(4.5, 14.0), 1))
            adas_cog = float(round(random.uniform(30.0, 58.0), 1))
            memory = float(round(random.uniform(-3.5, -1.8), 2))
            executive = float(round(random.uniform(-3.0, -1.2), 2))
            language = float(round(random.uniform(-2.8, -1.0), 2))
            faq = float(round(random.uniform(11.0, 26.0), 1))
            mri_avail = random.random() < 0.80
            pet_avail = random.random() < 0.60

        patient = {
            "patient_id": pid,
            "age": age,
            "sex": sex,
            "education_years": education,
            "apoe4_allele_count": apoe,
            "mmse": mmse,
            "cdrsb": cdrsb,
            "adas_cog13": adas_cog,
            "memory_score": memory,
            "executive_func": executive,
            "language_score": language,
            "faq_score": faq,
            "clinical_available": True,
            "mri_available": mri_avail,
            "pet_available": pet_avail,
            "synthetic_ground_truth_stage": stage
        }
        cohort.append(patient)

    return cohort

def save_synthetic_dataset(output_dir: str = "./data/synthetic"):
    os.makedirs(output_dir, exist_ok=True)
    cohort = generate_synthetic_cohort(160)
    
    # Save JSON
    json_path = os.path.join(output_dir, "synthetic_patients.json")
    with open(json_path, "w") as f:
        json.dump(cohort, f, indent=2)

    # Save CSV
    csv_path = os.path.join(output_dir, "synthetic_adni_cohort.csv")
    if cohort:
        keys = list(cohort[0].keys())
        with open(csv_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(cohort)

    print(f"Generated {len(cohort)} synthetic records at {output_dir}")
    return cohort
