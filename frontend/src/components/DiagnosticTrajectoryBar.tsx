"use client";

import React from "react";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

interface TrajectoryProps {
  currentStage: string;
  probabilities?: Record<string, number>;
  confidence: number;
}

const STAGES = [
  {
    key: "Normal Aging",
    label: "Normal Aging",
    subtext: "Intact cognition & age-appropriate reserve",
    color: "emerald",
    badge: "Stage 0",
  },
  {
    key: "Early MCI",
    label: "Early MCI",
    subtext: "Subtle episodic memory attenuation",
    color: "cyan",
    badge: "Stage 1",
  },
  {
    key: "Late MCI",
    label: "Late MCI",
    subtext: "Multi-domain cognitive & functional shifts",
    color: "amber",
    badge: "Stage 2",
  },
  {
    key: "Alzheimer's Disease",
    label: "Alzheimer's Disease",
    subtext: "Overt dementia continuum",
    color: "rose",
    badge: "Stage 3",
  },
];

export default function DiagnosticTrajectoryBar({ currentStage, probabilities, confidence }: TrajectoryProps) {
  const currentIndex = STAGES.findIndex((s) => s.key.toLowerCase() === currentStage?.toLowerCase());
  const activeIdx = currentIndex >= 0 ? currentIndex : 1;

  return (
    <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Disease Progression Model
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            Predicted Diagnostic Trajectory
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Ensemble Confidence</span>
            <span className="text-lg font-bold text-cyan-300">
              {Math.round(confidence * 100)}%
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            {currentStage}
          </div>
        </div>
      </div>

      {/* Trajectory progression step timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const prob = probabilities ? Math.round((probabilities[stage.key] || 0) * 100) : null;

          return (
            <div
              key={stage.key}
              className={`relative rounded-xl p-4 border transition-all ${
                isActive
                  ? "bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50 scale-[1.02]"
                  : isPast
                  ? "bg-slate-900/40 border-slate-700/60 opacity-80"
                  : "bg-slate-900/30 border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isActive ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/40" : "bg-slate-800 text-slate-400"
                }`}>
                  {stage.badge}
                </span>
                {isActive && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                )}
                {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <h4 className={`font-bold text-sm ${isActive ? "text-cyan-300 text-base" : "text-slate-200"}`}>
                {stage.label}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {stage.subtext}
              </p>

              {/* Stage probability bar */}
              {prob !== null && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Probability</span>
                    <span className="font-semibold text-slate-200">{prob}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                          : "bg-slate-600"
                      }`}
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Arrow on desktop between steps */}
              {idx < 3 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
