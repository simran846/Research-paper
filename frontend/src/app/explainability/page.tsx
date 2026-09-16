"use client";

import React from "react";
import { Cpu, Brain, Activity, Dna, User, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExplainabilityPage() {
  const domains = [
    {
      title: "1. Cognitive Function Domain",
      tag: "Owen-Value Group A",
      color: "from-blue-500 to-cyan-500",
      border: "border-cyan-500/30",
      features: [
        { name: "MMSE (Mini-Mental State Exam)", role: "Global cognitive status and orientation tracking (0-30)." },
        { name: "CDR-SB (Clinical Dementia Rating)", role: "Multi-domain functional and memory progression (0-18)." },
        { name: "ADAS-Cog 13", role: "Word recall, orientation, praxis, language severity (0-85)." },
        { name: "Memory Composite (Z)", role: "Standardized delayed word recall & episodic memory index." },
        { name: "Executive Function Composite (Z)", role: "Working memory, task switching, and executive control." },
      ],
      justification: "Grouping collinear cognitive scores eliminates mathematical instability in standard individual Shapley calculations where scores cancel each other out.",
    },
    {
      title: "2. Neuroimaging Biomarker Domain",
      tag: "Owen-Value Group B",
      color: "from-purple-500 to-indigo-500",
      border: "border-purple-500/30",
      features: [
        { name: "Medial Temporal / Hippocampus", role: "Early structural volume loss and neurofibrillary tangle progression." },
        { name: "Cortical Mantle (Parietotemporal)", role: "FDG-PET metabolic reduction and cortical surface thinning." },
        { name: "Lateral Ventricles", role: "Ex-vacuo CSF space enlargement marking advanced parenchymal loss." },
      ],
      justification: "Spatial region feature extraction produces anatomically meaningful regional attributions rather than opaque black-box voxel weights.",
    },
    {
      title: "3. Demographic & Cognitive Reserve Domain",
      tag: "Owen-Value Group C",
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/30",
      features: [
        { name: "Patient Age (Years)", role: "Primary non-modifiable biological risk factor." },
        { name: "Formal Education (Years)", role: "Proxy for neural resilience and cognitive reserve buffer." },
      ],
      justification: "Educational attainment moderates the clinical expression of pathology; isolating this domain provides clear equity insights.",
    },
    {
      title: "4. Genetic Susceptibility Domain",
      tag: "Owen-Value Group D",
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      features: [
        { name: "APOE-ε4 Allele Burden (0, 1, or 2)", role: "Major lipid transport gene accelerating amyloid-β deposition." },
      ],
      justification: "Separates constitutional baseline genetic risk from acute episodic cognitive fluctuations.",
    },
    {
      title: "5. Functional Activities Domain",
      tag: "Owen-Value Group E",
      color: "from-pink-500 to-rose-500",
      border: "border-pink-500/30",
      features: [
        { name: "FAQ (Functional Activities Questionnaire)", role: "Instrumental activities of daily living (finances, medication management)." },
      ],
      justification: "Differentiates MCI from manifest dementia where functional autonomy is preserved vs compromised.",
    },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Theoretical Framework
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
          Grouped Explainable AI (Owen-Value Style)
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Addressing the fundamental literature gap where standard SHAP attributions become noisy and uninterpretable under high feature collinearity.
        </p>
      </div>

      {/* Comparison: Standard SHAP vs Grouped XAI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-950/20 rounded-2xl p-6 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Standard Feature-Level SHAP (Literature Limitation)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When 20+ correlated cognitive tests (MMSE, MoCA, ADAS-Cog, CDR-SB, FAQ) are fed into tree ensembles or deep networks, standard Shapley values divide credit arbitrarily among collinear inputs. Clinicians receive noisy, conflicting attributions where one cognitive score receives high positive attribution while an equally critical test receives zero or negative weight.
          </p>
        </div>

        <div className="bg-emerald-950/20 rounded-2xl p-6 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Owen-Value Grouped XAI (Proposed Solution)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            By grouping variables into mutually exclusive, biologically coherent domains via coalition game theory (Owen values), the ensemble produces stable, intuitive, and mathematically rigorous domain attributions that sum strictly to 100%. Clinicians can immediately identify whether cognitive decline, genetics, or imaging drove the decision.
          </p>
        </div>
      </div>

      {/* 5 CLINICAL DOMAINS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>The 5 Clinically Grounded Feature Domains</span>
        </h2>

        <div className="space-y-4">
          {domains.map((dom) => (
            <div
              key={dom.title}
              className={`bg-[#1C2541]/90 rounded-2xl p-6 border ${dom.border} shadow-lg space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <h3 className="font-bold text-base text-white">{dom.title}</h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-cyan-300 border border-slate-700 self-start sm:self-auto">
                  {dom.tag}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dom.features.map((f) => (
                  <div key={f.name} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-xs text-cyan-200 block">{f.name}</span>
                    <p className="text-[11px] text-slate-400 leading-tight">{f.role}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-cyan-400">Clinical Rationale: </strong>
                {dom.justification}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to live assessment */}
      <div className="bg-gradient-to-r from-blue-900/40 via-[#1C2541] to-cyan-900/40 p-6 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-white text-base">Test Grouped XAI on Sample Cohorts</h3>
          <p className="text-xs text-slate-400">Evaluate how dynamic weighting and grouped attributions behave in real time.</p>
        </div>
        <Link
          href="/assessment/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>Launch Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
