"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Play, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles,
  Info,
  RefreshCw
} from "lucide-react";
import { runAblationApi } from "@/lib/api";
import { AblationResult } from "@/lib/types";

export default function AblationPage() {
  const [config, setConfig] = useState({
    enable_clinical: true,
    enable_mri: true,
    enable_pet: true,
    enable_dynamic_weighting: true,
    enable_grouped_xai: true,
  });

  const [result, setResult] = useState<AblationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runExperiment = async () => {
    setLoading(true);
    try {
      const res = await runAblationApi(config);
      setResult(res);
    } catch (err) {
      console.error("Ablation study error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runExperiment();
  }, []);

  const toggleComponent = (key: keyof typeof config) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Ablation Workbench
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Empirical Verification
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
            Architecture Component Ablation Study
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle modalities and algorithmic layers to empirically observe performance degradation, uncertainty inflation, and missing-modality behavior.
          </p>
        </div>

        <button
          onClick={runExperiment}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{loading ? "Running Cohort Ablation..." : "Run Ablation Experiment"}</span>
        </button>
      </div>

      {/* COMPONENT TOGGLE MATRIX */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="border-b border-slate-700/60 pb-3">
          <h3 className="font-bold text-white text-base">Interactive Architecture Configuration</h3>
          <p className="text-xs text-slate-400">Select which modalities and algorithmic submodules to include in the inference ensemble</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { key: "enable_clinical", label: "Tabular Clinical Data", desc: "MMSE, CDR-SB, APOE" },
            { key: "enable_mri", label: "Structural 3D MRI", desc: "Medial temporal volume" },
            { key: "enable_pet", label: "Metabolic FDG/Amyloid PET", desc: "Parietal hypometabolism" },
            { key: "enable_dynamic_weighting", label: "Dynamic Weighting", desc: "Adaptive alpha reallocation" },
            { key: "enable_grouped_xai", label: "Owen Grouped XAI", desc: "Collinearity-free attribution" },
          ].map((item) => {
            const isChecked = config[item.key as keyof typeof config];
            return (
              <div
                key={item.key}
                onClick={() => toggleComponent(item.key as keyof typeof config)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? "bg-blue-600/20 border-cyan-400 shadow-sm"
                    : "bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className="font-bold text-xs text-white">{item.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-6">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ABLATION EXPERIMENTAL RESULTS */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Performance Impact Summary */}
          <div className="lg:col-span-6 bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs text-cyan-400 font-mono">Experimental Outcome</span>
                <h3 className="font-bold text-white text-base mt-0.5">{result.config_name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-slate-200 border border-slate-700">
                F1: {result.metrics.f1_score.toFixed(3)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-500/30">
                <span className="text-xs text-slate-400 block">Macro F1 Drop</span>
                <span className="text-2xl font-bold text-rose-400 mt-1 block">
                  -{result.macro_f1_drop}%
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Relative to full ensemble</span>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30">
                <span className="text-xs text-slate-400 block">Uncertainty Inflation</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">
                  +{result.uncertainty_increase}%
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Epistemic ambiguity growth</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Ablation Degradation Analysis
              </span>
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {result.missing_modality_degradation}
              </div>
            </div>
          </div>

          {/* Right: Metrics Table under Ablated Configuration */}
          <div className="lg:col-span-6 bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-700/60 pb-3 mb-4">
                <h3 className="font-bold text-white text-base">Ablated Cohort Metrics</h3>
                <p className="text-xs text-slate-400">Cross-validation statistics under current toggles</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Accuracy", val: `${(result.metrics.accuracy * 100).toFixed(1)}%` },
                  { label: "AUROC", val: result.metrics.auroc.toFixed(3) },
                  { label: "Sensitivity", val: `${(result.metrics.sensitivity * 100).toFixed(1)}%` },
                  { label: "Specificity", val: `${(result.metrics.specificity * 100).toFixed(1)}%` },
                  { label: "Precision", val: `${(result.metrics.precision * 100).toFixed(1)}%` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-xs p-2.5 bg-slate-900/70 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-medium">{row.label}</span>
                    <span className="font-bold text-cyan-300">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 italic">
              Demonstrates empirical value of multimodal fusion + dynamic weighting over naive single-branch baselines.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
