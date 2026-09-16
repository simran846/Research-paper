"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldAlert, BookOpen, GitBranch, FileCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white">NeuroTriage AI</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            A research prototype engineering an explainable ensemble for Alzheimer&apos;s risk stratification and clinical triage. Combining Owen-value grouped explainability, dynamic modality weighting for missing neuroimaging, and calibrated uncertainty.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-blue-400" /> ADNI Framework</span>
            <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5 text-cyan-400" /> Multimodal Ensemble</span>
            <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5 text-emerald-400" /> PyTorch / XGBoost / FastAPI</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Research Modules</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/dashboard" className="hover:text-cyan-300">Clinician Dashboard</Link></li>
            <li><Link href="/assessment/new" className="hover:text-cyan-300">New Assessment Wizard</Link></li>
            <li><Link href="/explainability" className="hover:text-cyan-300">Grouped XAI Breakdown</Link></li>
            <li><Link href="/ablation" className="hover:text-cyan-300">Ablation Study Workbench</Link></li>
            <li><Link href="/dataset" className="hover:text-cyan-300">ADNI Dataset Integration</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Ethical Compliance</h4>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-start gap-1.5 text-amber-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Non-Diagnostic Notice</span>
            </div>
            <p>
              Outputs do not constitute clinical diagnoses. All predictions are simulated research estimates grounded in academic literature.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2026 NeuroTriage AI — Academic Research & Decision-Support Demonstration.</p>
        <div className="flex gap-6">
          <Link href="/explainability" className="hover:text-slate-300">Methodology</Link>
          <Link href="/analytics" className="hover:text-slate-300">Benchmarks</Link>
          <Link href="/dataset" className="hover:text-slate-300">Data Guidelines</Link>
        </div>
      </div>
    </footer>
  );
}
