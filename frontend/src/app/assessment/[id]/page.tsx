"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Download, 
  ArrowLeft, 
  Bot, 
  Share2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Layers,
  Sparkles
} from "lucide-react";
import { getAssessmentApi, getReportDownloadUrl } from "@/lib/api";
import { AssessmentData } from "@/lib/types";
import DiagnosticTrajectoryBar from "@/components/DiagnosticTrajectoryBar";
import DynamicWeightingFlow from "@/components/DynamicWeightingFlow";
import GroupedXAIWaterfall from "@/components/GroupedXAIWaterfall";
import BrainAttentionViewer from "@/components/BrainAttentionViewer";
import TriageRecommendationCard from "@/components/TriageRecommendationCard";
import NeuroTriageAssistantModal from "@/components/NeuroTriageAssistantModal";

export default function AssessmentResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await getAssessmentApi(id);
        setAssessment(data);
      } catch (err: any) {
        setError(err.message || "Failed to load assessment.");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadAssessment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-white">Synthesizing Multimodal Results...</h3>
        <p className="text-xs text-slate-400">Evaluating dynamic weights, Owen-value attributions, and triage confidence.</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Assessment Record Not Found</h3>
        <p className="text-xs text-slate-400">{error || "Unable to retrieve the requested assessment ID."}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const isMissingImaging = !assessment.modalities.mri && !assessment.modalities.pet;

  return (
    <div className="space-y-8 py-4">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Assessment Results: <span className="text-cyan-400 font-mono">{assessment.patient_id}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
              ID #{assessment.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAssistantOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 shadow-sm transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>

          <a
            href={getReportDownloadUrl(assessment.id)}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Research PDF</span>
          </a>
        </div>
      </div>

      {/* MISSING MODALITY ADAPTATION ALERT (IF IMAGING WAS MISSING) */}
      {isMissingImaging && (
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent p-4 rounded-2xl border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 block text-sm">
              Imaging Data Unavailable — Dynamic Modality Weighting Activated
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Structural MRI and FDG-PET scans were not provided. The system adapted by assigning <strong className="text-white">100% weight to verified tabular clinical/cognitive predictors</strong> rather than synthesizing artificial imaging features or failing. Epistemic uncertainty is transparently reported below.
            </p>
          </div>
        </div>
      )}

      {/* 1. DIAGNOSTIC TRAJECTORY STEP BAR */}
      <DiagnosticTrajectoryBar
        currentStage={assessment.trajectory_stage}
        probabilities={assessment.stage_probabilities}
        confidence={assessment.confidence}
      />

      {/* 2. DYNAMIC MODALITY WEIGHTING FLOW */}
      <DynamicWeightingFlow
        modalities={assessment.modalities}
        dynamicWeights={assessment.dynamic_weights}
      />

      {/* 3. GROUPED XAI & BRAIN ATTENTION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <GroupedXAIWaterfall explanations={assessment.explanations} />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <BrainAttentionViewer
            regionAttentions={assessment.explanations?.imaging_regions}
            imagingAvailable={assessment.modalities.mri || assessment.modalities.pet}
          />
        </div>
      </div>

      {/* 4. AI TRIAGE & CLINICAL DECISION SUPPORT CARD */}
      <TriageRecommendationCard
        triage={assessment.triage}
        confidence={assessment.confidence}
        uncertainty={assessment.uncertainty_score}
        stage={assessment.trajectory_stage}
      />

      {/* 5. CLINICAL RECORD AUDIT & MODEL LIMITATIONS */}
      <div className="bg-[#1C2541]/70 rounded-2xl p-6 border border-slate-700 space-y-4">
        <div className="border-b border-slate-700/60 pb-3">
          <h3 className="text-base font-bold text-white">Input Feature Values & Clinical Audit</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Age / Sex</span>
            <span className="font-semibold text-white">{assessment.clinical_values.age} yrs • {assessment.clinical_values.sex}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">MMSE Score</span>
            <span className="font-semibold text-cyan-300">{assessment.clinical_values.mmse} / 30</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">CDR Sum of Boxes</span>
            <span className="font-semibold text-cyan-300">{assessment.clinical_values.cdrsb}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">ADAS-Cog 13</span>
            <span className="font-semibold text-cyan-300">{assessment.clinical_values.adas_cog13}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">APOE-ε4 Carrier</span>
            <span className="font-semibold text-amber-300">{assessment.clinical_values.apoe4_allele_count} Allele(s)</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">FAQ Functional</span>
            <span className="font-semibold text-white">{assessment.clinical_values.faq_score}</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 italic">
          Disclaimer: This assessment summary is generated for academic research decision support. All outputs are statistical simulations and do not replace formal clinical assessment by a board-certified neurologist or geriatrician.
        </div>
      </div>

      {/* AI Assistant Modal */}
      <NeuroTriageAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        assessmentId={assessment.id}
      />
    </div>
  );
}
