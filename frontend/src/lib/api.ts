import {
  AssessmentData,
  AssessmentInput,
  AnalyticsData,
  AblationResult,
  PatientRecord
} from "./types";

// When running in the browser, use relative '/api' so Next.js proxy rewrite routes it automatically
// When running server-side, fallback to backend direct URL
const isServer = typeof window === "undefined";
const API_BASE = isServer
  ? (process.env.INTERNAL_API_URL || "http://127.0.0.1:8000/api")
  : (process.env.NEXT_PUBLIC_API_URL || "/api");

export async function runAssessmentApi(data: AssessmentInput): Promise<AssessmentData> {
  const response = await fetch(`${API_BASE}/assessment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function getAssessmentApi(id: number | string): Promise<AssessmentData> {
  const response = await fetch(`${API_BASE}/assessment/${id}`);
  if (!response.ok) {
    throw new Error(`Assessment not found: ${response.status}`);
  }
  return response.json();
}

export async function listAssessmentsApi(limit = 60): Promise<AssessmentData[]> {
  const response = await fetch(`${API_BASE}/assessments?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to load assessments: ${response.status}`);
  }
  return response.json();
}

export async function listPatientsApi(search?: string): Promise<PatientRecord[]> {
  const url = search ? `${API_BASE}/patients/?search=${encodeURIComponent(search)}` : `${API_BASE}/patients/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load patients: ${response.status}`);
  }
  return response.json();
}

export async function getAnalyticsApi(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE}/analytics/`);
  if (!response.ok) {
    throw new Error(`Failed to load analytics: ${response.status}`);
  }
  return response.json();
}

export async function runAblationApi(config: {
  enable_mri: boolean;
  enable_pet: boolean;
  enable_clinical: boolean;
  enable_dynamic_weighting: boolean;
  enable_grouped_xai: boolean;
}): Promise<AblationResult> {
  const response = await fetch(`${API_BASE}/ablation/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error(`Ablation run failed: ${response.status}`);
  }
  return response.json();
}

export async function chatAssistantApi(params: {
  assessment_id?: number;
  message: string;
  conversation_history?: { role: string; content: string }[];
}): Promise<{ reply: string; suggested_followups: string[] }> {
  const response = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(`Assistant error: ${response.status}`);
  }
  return response.json();
}

export function getReportDownloadUrl(assessmentId: number | string): string {
  return `${API_BASE}/report/${assessmentId}`;
}
