"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { TriageInfo } from "@/lib/types";

interface TriageCardProps {
  triage: TriageInfo;
  confidence: number;
  uncertainty: number;
  stage: string;
}

export default function TriageRecommendationCard({ triage, confidence, uncertainty, stage }: TriageCardProps) {
  const isHighRisk = stage === "Late MCI" || stage === "Alzheimer's Disease";
  const isRecommendImaging = triage.status === "RECOMMEND_IMAGING_CONFIRMATION";

  const getStatusBadge = () => {
    if (triage.status === "HIGH_CONFIDENCE_STANDARD") {
      return {
        icon: ShieldCheck,
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        label: "Standard Protocol Follow-Up",
      };
    }
    if (triage.status === "RECOMMEND_IMAGING_CONFIRMATION") {
      return {
        icon: AlertTriangle,
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        label: "Targeted Imaging Suggested",
      };
    }
    return {
      icon: AlertCircle,
      bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
      label: "Multidisciplinary Review",
    };
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  return (
    <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Clinical Decision Support
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            AI Triage & Uncertainty Assessment
          </h3>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${badge.bg}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Uncertainty & Confidence Metrics Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Predicted Stage</span>
          <span className="text-lg font-bold text-white mt-1 block">{stage}</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Model Confidence</span>
            <span className="font-semibold text-emerald-400">{Math.round(confidence * 100)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Calibrated Uncertainty</span>
            <span className="font-semibold text-amber-400">{Math.round(uncertainty * 100)}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.round(uncertainty * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Triage Recommendation Box */}
      <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 space-y-3">
        <h4 className="font-bold text-base text-cyan-300">
          {triage.title}
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed">
          {triage.recommendation}
        </p>

        <div className="pt-3 border-t border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Decision Rationale
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {triage.rationale}
          </p>
        </div>

        {/* Suggested research next steps */}
        {triage.suggested_actions && triage.suggested_actions.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Suggested Research Next Steps
            </span>
            <ul className="space-y-1.5">
              {triage.suggested_actions.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400 italic">
        * Triage suggestions are intended solely to assist clinical trial eligibility screening and research workflows.
      </div>
    </div>
  );
}
