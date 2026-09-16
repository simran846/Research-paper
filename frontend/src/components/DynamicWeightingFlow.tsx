"use client";

import React from "react";
import { Check, X, ShieldAlert, Cpu, Sparkles, ArrowRight } from "lucide-react";
import { Modalities, DynamicWeights } from "@/lib/types";

interface FlowProps {
  modalities: Modalities;
  dynamicWeights: DynamicWeights;
  onToggleModality?: (modality: keyof Modalities) => void;
  interactive?: boolean;
}

export default function DynamicWeightingFlow({
  modalities,
  dynamicWeights,
  onToggleModality,
  interactive = false,
}: FlowProps) {
  const branches = [
    {
      key: "clinical" as keyof Modalities,
      title: "Tabular Clinical / Cognitive",
      subtitle: "MMSE, CDR-SB, ADAS-Cog13, APOE-ε4",
      available: modalities.clinical,
      weight: dynamicWeights.clinical,
      color: "from-blue-600 to-indigo-600",
      border: "border-blue-500",
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      key: "mri" as keyof Modalities,
      title: "Structural 3D MRI",
      subtitle: "Medial Temporal & Hippocampal Volumetry",
      available: modalities.mri,
      weight: dynamicWeights.mri,
      color: "from-cyan-600 to-teal-600",
      border: "border-cyan-500",
      accent: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      key: "pet" as keyof Modalities,
      title: "Metabolic FDG/Amyloid PET",
      subtitle: "Parietotemporal Hypometabolism",
      available: modalities.pet,
      weight: dynamicWeights.pet,
      color: "from-purple-600 to-pink-600",
      border: "border-purple-500",
      accent: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const hasMissingImaging = !modalities.mri || !modalities.pet;

  return (
    <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Core Algorithmic Innovation
            </span>
            {hasMissingImaging && (
              <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Missing Modality Adapted
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            Dynamic Modality Weighting & Fusion Engine
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-sm text-right">
          Adaptive α-weighting prevents zero-imputation hallucinations when imaging is unavailable.
        </p>
      </div>

      {/* Interactive Fusion Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3 Input Modality Branches */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Input Modalities {interactive && "(Click to Toggle)"}
          </span>
          {branches.map((b) => (
            <div
              key={b.key}
              onClick={() => interactive && onToggleModality && onToggleModality(b.key)}
              className={`p-3.5 rounded-xl border transition-all ${
                b.available
                  ? `${b.bg} ${b.border} shadow-md`
                  : "bg-slate-900/40 border-slate-800 opacity-50"
              } ${interactive ? "cursor-pointer hover:scale-[1.01]" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      b.available ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {b.available ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{b.title}</h4>
                    <p className="text-[11px] text-slate-400">{b.subtitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Assigned Weight</span>
                  <span className={`text-base font-bold ${b.available ? b.accent : "text-slate-600"}`}>
                    {Math.round(b.weight * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center: Dynamic Weighting & Normalization Core */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center bg-slate-900/80 p-5 rounded-xl border border-slate-700 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-3 animate-pulse-subtle">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-sm text-white">Dynamic Weight Engine</h4>
          <span className="text-[11px] text-cyan-300 mt-0.5">α-Softmax Normalizer</span>
          <div className="w-full my-3 border-t border-slate-800" />
          <div className="text-xs text-slate-400 space-y-1 text-left w-full">
            <div className="flex justify-between">
              <span>Active Branches:</span>
              <span className="font-semibold text-white">
                {Object.values(modalities).filter(Boolean).length} / 3
              </span>
            </div>
            <div className="flex justify-between">
              <span>Weight Sum (Σα):</span>
              <span className="font-semibold text-emerald-400">100.0%</span>
            </div>
            <div className="flex justify-between">
              <span>Imputation Strategy:</span>
              <span className="font-semibold text-cyan-400">Zero Artificial Data</span>
            </div>
          </div>
        </div>

        {/* Right: Multimodal Ensemble & Stratification */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-xl border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Fused Ensemble Output</span>
          </div>

          <div className="space-y-2">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Adaptive Mechanism</span>
              <p className="text-xs text-slate-200 mt-1">
                {modalities.mri && modalities.pet
                  ? "Full cross-modal integration active. High spatial and metabolic resolution."
                  : !modalities.mri && !modalities.pet
                  ? "Neuroimaging is missing: Clinical branch dynamically receives 100% weight with calibrated uncertainty penalty."
                  : "Partial imaging available: Weights recalculated between available modalities without synthetic artifacts."}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-center justify-between">
              <span>Epistemic Uncertainty:</span>
              <span className="font-bold text-blue-300">
                {!modalities.mri && !modalities.pet ? "Moderate (Clinical Only)" : "Low (Multimodal)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Scientific Disclaimer */}
      <div className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 text-[11px] text-amber-300/80 flex items-center justify-between">
        <span>Demo weighting — not clinically validated.</span>
        <span className="text-slate-400">Research & Academic Decision Support Prototype</span>
      </div>
    </div>
  );
}
