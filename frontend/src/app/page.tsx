"use client";

import React from "react";
import Link from "next/link";
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Brain, 
  Sparkles, 
  GitBranch, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Database,
  BarChart3,
  Search,
  Play,
  Zap
} from "lucide-react";
import { PRESET_PATIENTS } from "@/lib/synthetic-samples";

export default function LandingPage() {
  const gaps = [
    {
      num: "01",
      title: "Collinear SHAP Explanation Noise",
      problem: "Standard Shapley attributions become unstable when clinical & cognitive variables are correlated (MMSE, CDR-SB, ADAS-Cog).",
      solution: "Owen-Value Grouped XAI aggregates variables into 5 clinically grounded domains summing strictly to 100%.",
    },
    {
      num: "02",
      title: "Fragility to Missing Neuroimaging",
      problem: "Multimodal systems crash or rely on flawed zero-imputation when expensive MRI/PET scans are unavailable.",
      solution: "Dynamic Modality Weighting detects available modalities and recalculates fusion weights on-the-fly.",
    },
    {
      num: "03",
      title: "Single-Modality Diagnostic Blindness",
      problem: "Pure imaging ignores longitudinal cognitive scores; pure tabular models miss early hippocampal atrophy.",
      solution: "Dual-branch ensemble (3D CNN + TabNet/XGBoost) fuses spatial and clinical embeddings.",
    },
    {
      num: "04",
      title: "Indiscriminate Scan Baseline Ordering",
      problem: "Ordering costly PET/MRI for every patient overwhelms healthcare infrastructure.",
      solution: "AI Triage Engine identifies high-uncertainty cases and selectively recommends imaging confirmation.",
    },
  ];

  return (
    <div className="space-y-20 py-6">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C2541] via-[#1C2541]/90 to-[#0B132B] p-8 sm:p-12 lg:p-16 border border-slate-700/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Research Prototype • ADNI Framework</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Explainable AI for <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">Alzheimer&apos;s Triage</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Multimodal risk stratification that combines clinical, cognitive, and neuroimaging information while remaining interpretable. Powered by Dynamic Modality Weighting for missing MRI/PET data and Owen-value Grouped XAI.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/assessment/new"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/assessment/new?preset=demo-patient-01"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white font-semibold text-sm border border-cyan-500/40 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Try Demo (Case 1: Missing MRI/PET)</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
            <div>
              <span className="text-2xl font-bold text-white block">4 Stages</span>
              <span className="text-xs text-slate-400">Normal to AD Continuum</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-cyan-400 block">100% Dynamic</span>
              <span className="text-xs text-slate-400">Missing Modality Adaptation</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400 block">5 Groups</span>
              <span className="text-xs text-slate-400">Owen-Value Explainability</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-400 block">Transparent</span>
              <span className="text-xs text-slate-400">Uncertainty Triage</span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE DEMO PATIENT SCENARIOS (DYNAMIC WEIGHTING COMPARISON) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Interactive Modality Weighting Demo
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">Synthetic Demo Patient Profiles</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md text-left sm:text-right">
            Evaluate how the ensemble dynamically recalculates fusion weights across missing and available modalities without synthetic hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESET_PATIENTS.slice(0, 3).map((preset) => (
            <div
              key={preset.id}
              className="bg-[#1C2541]/85 p-5 rounded-2xl border border-slate-700 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-cyan-300">{preset.data.patient_id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                    {preset.tag}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{preset.name}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{preset.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-700/60">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Clinical</span>
                    <span className="font-bold text-emerald-400">Available</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">MRI</span>
                    <span className={`font-bold ${preset.data.mri_available ? "text-cyan-400" : "text-slate-500"}`}>
                      {preset.data.mri_available ? "Available" : "Missing"}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">PET</span>
                    <span className={`font-bold ${preset.data.pet_available ? "text-purple-400" : "text-slate-500"}`}>
                      {preset.data.pet_available ? "Available" : "Missing"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/assessment/new?preset=${preset.id}`}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Evaluate Demo Case</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LITERATURE GAPS & OUR INNOVATIONS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Scientific Foundation
          </span>
          <h2 className="text-3xl font-bold text-white">Literature Gaps & Solutions</h2>
          <p className="text-sm text-slate-400">
            Overcoming the key structural bottlenecks in contemporary multimodal neurodegenerative machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gaps.map((g) => (
            <div
              key={g.num}
              className="bg-[#1C2541]/80 rounded-2xl p-6 border border-slate-700 shadow-lg space-y-4 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-cyan-400/60">{g.num}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Novel Mechanism
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{g.title}</h3>

              <div className="space-y-2 text-xs">
                <div className="bg-rose-950/30 border border-rose-500/20 p-3 rounded-lg text-rose-200">
                  <strong className="text-rose-400 block mb-0.5">Existing Literature Gap:</strong>
                  {g.problem}
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg text-emerald-200">
                  <strong className="text-emerald-400 block mb-0.5">NeuroTriage Innovation:</strong>
                  {g.solution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-STAGE DIAGNOSTIC TRAJECTORY */}
      <section className="bg-gradient-to-br from-slate-900 via-[#1C2541] to-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Clinical Continuum
          </span>
          <h2 className="text-3xl font-bold text-white">4-Stage Diagnostic Trajectory</h2>
          <p className="text-sm text-slate-400">
            Stratifying neurodegenerative progression from preclinical aging to manifest dementia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Stage 0</span>
            <h4 className="font-bold text-base text-white">Normal Aging</h4>
            <p className="text-xs text-slate-400">Intact functional independence. Stable MMSE (28-30) and CDR-SB (0.0).</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">Stage 1</span>
            <h4 className="font-bold text-base text-white">Early MCI</h4>
            <p className="text-xs text-slate-400">Subtle episodic memory attenuation. Sensitive to dynamic weighting adaptation.</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-amber-500/30 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">Stage 2</span>
            <h4 className="font-bold text-base text-white">Late MCI</h4>
            <p className="text-xs text-slate-400">Multi-domain cognitive shifts, elevated ADAS-Cog13, and hippocampal atrophy.</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-rose-500/30 space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">Stage 3</span>
            <h4 className="font-bold text-base text-white">Alzheimer&apos;s Disease</h4>
            <p className="text-xs text-slate-400">Severe cognitive and functional activities deficit. Urgent multidisciplinary review.</p>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE OVERVIEW */}
      <section className="bg-[#1C2541]/90 rounded-3xl p-8 sm:p-10 border border-slate-700 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            System Topology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Full-Stack AI Architecture</h2>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre className="text-cyan-300/90">
{`                 USER / CLINICIAN
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
              DOWNLOADABLE RESEARCH REPORT (PDF)`}
          </pre>
        </div>
      </section>
    </div>
  );
}
