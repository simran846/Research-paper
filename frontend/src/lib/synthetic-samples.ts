import { AssessmentInput } from "./types";

export interface PresetPatient {
  id: string;
  name: string;
  tag: string;
  description: string;
  data: AssessmentInput;
}

export const PRESET_PATIENTS: PresetPatient[] = [
  {
    id: "demo-patient-01",
    name: "Demo Patient 01 — Missing Neuroimaging",
    tag: "Clinical: 100% | MRI: 0% | PET: 0%",
    description: "Age 72, APOE-ε4 positive, mild memory attenuation. Structural MRI & PET unavailable. Demonstrates adaptive Dynamic Weighting (100% Clinical) and uncertainty-driven triage suggestion.",
    data: {
      patient_id: "DEMO-PT-01",
      age: 72,
      sex: "Female",
      education_years: 16,
      apoe4_allele_count: 1,
      mmse: 23.5,
      cdrsb: 2.5,
      adas_cog13: 18.0,
      memory_score: -0.95,
      executive_func: -0.45,
      language_score: -0.20,
      faq_score: 3.5,
      clinical_available: true,
      mri_available: false,
      pet_available: false,
    },
  },
  {
    id: "demo-patient-02",
    name: "Demo Patient 02 — MRI Available, PET Missing",
    tag: "Clinical: 55% | MRI: 45% | PET: 0%",
    description: "Age 74, APOE-ε4 positive, moderate memory loss. 3D MRI scan uploaded, PET unavailable. Demonstrates dynamic 2-branch cross-modal fusion and medial temporal hippocampal attention.",
    data: {
      patient_id: "DEMO-PT-02",
      age: 74,
      sex: "Male",
      education_years: 16,
      apoe4_allele_count: 1,
      mmse: 22.0,
      cdrsb: 3.5,
      adas_cog13: 22.0,
      memory_score: -1.35,
      executive_func: -0.80,
      language_score: -0.50,
      faq_score: 5.5,
      clinical_available: true,
      mri_available: true,
      pet_available: false,
    },
  },
  {
    id: "demo-patient-03",
    name: "Demo Patient 03 — Full Multimodal Available",
    tag: "Clinical: 40% | MRI: 35% | PET: 25%",
    description: "Age 76, APOE 2-alleles, pronounced episodic memory and functional deficits. Both 3D MRI and FDG-PET available. Demonstrates 3-way fusion, low uncertainty, and high confidence.",
    data: {
      patient_id: "DEMO-PT-03",
      age: 76,
      sex: "Female",
      education_years: 18,
      apoe4_allele_count: 2,
      mmse: 20.5,
      cdrsb: 4.5,
      adas_cog13: 28.0,
      memory_score: -1.95,
      executive_func: -1.40,
      language_score: -0.90,
      faq_score: 8.5,
      clinical_available: true,
      mri_available: true,
      pet_available: true,
    },
  },
  {
    id: "demo-patient-04",
    name: "Demo Patient 04 — Normal Aging Benchmark",
    tag: "High Confidence Standard",
    description: "Age 68, APOE non-carrier, intact cognition (MMSE 29.5, CDR-SB 0.0). High confidence standard annual follow-up recommendation.",
    data: {
      patient_id: "DEMO-PT-04",
      age: 68,
      sex: "Male",
      education_years: 16,
      apoe4_allele_count: 0,
      mmse: 29.5,
      cdrsb: 0.0,
      adas_cog13: 5.5,
      memory_score: 1.20,
      executive_func: 1.05,
      language_score: 0.90,
      faq_score: 0.0,
      clinical_available: true,
      mri_available: true,
      pet_available: false,
    },
  },
];
