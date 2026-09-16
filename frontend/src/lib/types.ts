export interface Modalities {
  clinical: boolean;
  mri: boolean;
  pet: boolean;
}

export interface DynamicWeights {
  clinical: number;
  mri: number;
  pet: number;
}

export interface GroupedExplanations {
  cognitive_contrib: number;
  imaging_contrib: number;
  demographic_contrib: number;
  genetic_contrib: number;
  functional_contrib: number;
  detailed_features: Record<string, number>;
  imaging_regions: Record<string, number>;
}

export interface TriageInfo {
  status: string;
  title: string;
  recommendation: string;
  rationale: string;
  suggested_actions: string[];
}

export interface AssessmentData {
  id: number;
  patient_id: string;
  assessment_date: string;
  modalities: Modalities;
  trajectory_stage: "Normal Aging" | "Early MCI" | "Late MCI" | "Alzheimer's Disease" | string;
  confidence: number;
  uncertainty_score: number;
  risk_level: "Low" | "Moderate" | "High" | "Severe" | string;
  stage_probabilities: Record<string, number>;
  dynamic_weights: DynamicWeights;
  explanations: GroupedExplanations;
  triage: TriageInfo;
  clinical_values: {
    age: number;
    sex: string;
    education_years: number;
    apoe4_allele_count: number;
    mmse: number;
    cdrsb: number;
    adas_cog13: number;
    memory_score: number;
    executive_func: number;
    language_score: number;
    faq_score: number;
  };
  demo_mode: boolean;
  disclaimer: string;
}

export interface AssessmentInput {
  patient_id: string;
  age: number;
  sex: string;
  education_years: number;
  apoe4_allele_count: number;
  mmse: number;
  cdrsb: number;
  adas_cog13: number;
  memory_score: number;
  executive_func: number;
  language_score: number;
  faq_score: number;
  clinical_available: boolean;
  mri_available: boolean;
  pet_available: boolean;
  mri_file_id?: string;
  pet_file_id?: string;
}

export interface ModelMetrics {
  accuracy: number;
  sensitivity: number;
  specificity: number;
  precision: number;
  f1_score: number;
  auroc: number;
}

export interface BaselineComparison {
  model_name: string;
  modality_support: string;
  accuracy: number;
  f1_score: number;
  auroc: number;
  missing_modality_robustness: string;
  explainability_type: string;
}

export interface AnalyticsData {
  demo_mode: boolean;
  status_message: string;
  active_ensemble_metrics: ModelMetrics;
  baseline_comparisons: BaselineComparison[];
  confusion_matrix: number[][];
  stage_labels: string[];
  roc_curve_data: { fpr: number; tpr: number }[];
}

export interface AblationResult {
  config_name: string;
  metrics: ModelMetrics;
  macro_f1_drop: number;
  uncertainty_increase: number;
  missing_modality_degradation: string;
  weights_preview: DynamicWeights;
}

export interface PatientRecord {
  id: number;
  patient_id: string;
  age: number;
  sex: string;
  education_years: number;
  apoe4_allele_count: number;
  created_at: string;
}
