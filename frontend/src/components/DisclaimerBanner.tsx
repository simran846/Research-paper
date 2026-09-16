"use client";

import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200/90 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>RESEARCH & CLINICAL DECISION-SUPPORT PROTOTYPE ONLY:</strong> This software is an academic demonstration system. It does not provide medical diagnoses, treatment planning, or medication recommendations.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Simulated ADNI-Grounded Demo Mode</span>
        </div>
      </div>
    </div>
  );
}
