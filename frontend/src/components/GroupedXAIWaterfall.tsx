"use client";

import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Brain, Dna, User, Activity, Sparkles } from "lucide-react";
import { GroupedExplanations } from "@/lib/types";

interface XAIProps {
  explanations: GroupedExplanations;
}

export default function GroupedXAIWaterfall({ explanations }: XAIProps) {
  const [expanded, setExpanded] = useState(false);

  const groups = [
    {
      name: "Cognitive Function",
      value: explanations.cognitive_contrib,
      desc: "MMSE, CDR-SB, ADAS-Cog13, Memory & Executive Composite Z-Scores",
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      textColor: "text-cyan-300",
      barColor: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
    {
      name: "Neuroimaging Markers",
      value: explanations.imaging_contrib,
      desc: "Medial Temporal / Hippocampus, Cortical Mantle & Ventricular ROIs",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      textColor: "text-purple-300",
      barColor: "bg-gradient-to-r from-purple-500 to-indigo-400",
    },
    {
      name: "Demographics & Reserve",
      value: explanations.demographic_contrib,
      desc: "Patient Age and Educational Cognitive Reserve Buffer",
      icon: User,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-300",
      barColor: "bg-gradient-to-r from-emerald-500 to-teal-400",
    },
    {
      name: "Genetic Susceptibility",
      value: explanations.genetic_contrib,
      desc: "APOE-ε4 Allele Burden (0, 1, or 2 Risk Alleles)",
      icon: Dna,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-300",
      barColor: "bg-gradient-to-r from-amber-500 to-orange-400",
    },
    {
      name: "Functional Activities",
      value: explanations.functional_contrib,
      desc: "FAQ Functional Activities of Daily Living Questionnaire",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      textColor: "text-pink-300",
      barColor: "bg-gradient-to-r from-pink-500 to-rose-400",
    },
  ];

  return (
    <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Explainable AI (XAI)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Owen-Value Grouping
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            Grouped Feature Contribution
          </h3>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>{expanded ? "Hide Individual Variables" : "Drill-Down Variables"}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Grouped Bars */}
      <div className="space-y-4">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <div key={g.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <span className="font-semibold text-slate-200">{g.name}</span>
                  <span className="text-[11px] text-slate-400 hidden md:inline">
                    — {g.desc}
                  </span>
                </div>
                <span className={`font-bold text-sm ${g.textColor}`}>
                  {g.value}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full ${g.barColor} transition-all duration-700`}
                  style={{ width: `${Math.max(2, g.value)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Granular Feature Breakdown */}
      {expanded && explanations.detailed_features && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-3 bg-slate-900/60 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Granular Sub-Feature Impact (Within Groups)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(explanations.detailed_features).map(([feat, score]) => (
              <div key={feat} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-mono">{feat}</span>
                <span className="font-semibold text-cyan-300">+{score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XAI Methodology Note */}
      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Game-Theoretic Grouping:</strong> Owen-value aggregation mitigates collinearity artifacts among correlated cognitive tests (MMSE, CDR-SB, ADAS-Cog13). Group attributions sum strictly to 100%.
        </span>
      </div>
    </div>
  );
}
