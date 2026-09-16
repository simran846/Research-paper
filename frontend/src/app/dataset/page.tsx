"use client";

import React, { useState } from "react";
import { 
  Database, 
  Download, 
  FileCode, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Filter,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { PRESET_PATIENTS } from "@/lib/synthetic-samples";
import Link from "next/link";

export default function DatasetPage() {
  const [search, setSearch] = useState("");

  const dataDictionary = [
    { field: "patient_id", type: "string", range: "ADNI-SYN-XXXX", desc: "Anonymized unique participant identifier" },
    { field: "age", type: "float", range: "50 - 95", desc: "Patient chronological age at assessment date" },
    { field: "sex", type: "string", range: "Male / Female", desc: "Biological sex" },
    { field: "education_years", type: "float", range: "6 - 22", desc: "Years of formal education (Cognitive Reserve proxy)" },
    { field: "apoe4_allele_count", type: "int", range: "0, 1, 2", desc: "Apolipoprotein E ε4 allele carriage burden" },
    { field: "mmse", type: "float", range: "0 - 30", desc: "Mini-Mental State Examination score (Lower is worse)" },
    { field: "cdrsb", type: "float", range: "0 - 18", desc: "Clinical Dementia Rating Sum of Boxes score (Higher is worse)" },
    { field: "adas_cog13", type: "float", range: "0 - 85", desc: "Alzheimer's Disease Assessment Scale - Cognitive 13 item" },
    { field: "memory_score", type: "float", range: "-3.5 to +2.0", desc: "Standardized memory composite Z-score" },
    { field: "executive_func", type: "float", range: "-3.0 to +2.0", desc: "Standardized executive function composite Z-score" },
    { field: "faq_score", type: "float", range: "0 - 30", desc: "Functional Activities Questionnaire score" },
    { field: "mri_available", type: "bool", range: "True / False", desc: "Flag indicating availability of 3D structural MRI" },
    { field: "pet_available", type: "bool", range: "True / False", desc: "Flag indicating availability of FDG/Amyloid PET" },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              ADNI Grounding & Data Architecture
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              150+ Synthetic Cohort Records
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
            Dataset & ADNI Integration Module
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthetic cohort explorer, ADNI data dictionary, and step-by-step instructions for connecting authorized research datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/data/synthetic/synthetic_adni_cohort.csv"
            download
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </Link>
          <Link
            href="/data/synthetic/synthetic_patients.json"
            download
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </Link>
        </div>
      </div>

      {/* ADNI COMPLIANCE NOTICE */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>ADNI Data Governance & Repository Privacy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Alzheimer&apos;s Disease Neuroimaging Initiative (ADNI) data is subject to strict data-use agreements and cannot be bundled into public repositories. This application ships with a fully synthetic cohort grounded mathematically in published ADNI distributions. Researchers with approved ADNI credentials can point the data loader to their local extracted directory.
        </p>
      </div>

      {/* SYNTHETIC COHORT PREVIEW */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div>
            <h3 className="font-bold text-white text-base">Synthetic Patient Cohort Explorer</h3>
            <p className="text-xs text-slate-400">Sample patient records ready for evaluation</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sample cases..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Age / Sex</th>
                <th className="p-3">MMSE</th>
                <th className="p-3">CDR-SB</th>
                <th className="p-3">ADAS-13</th>
                <th className="p-3">APOE-ε4</th>
                <th className="p-3">MRI</th>
                <th className="p-3">PET</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {PRESET_PATIENTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-semibold text-cyan-300">{p.data.patient_id}</td>
                  <td className="p-3 text-slate-300">{p.data.age} / {p.data.sex}</td>
                  <td className="p-3 text-slate-200 font-medium">{p.data.mmse}</td>
                  <td className="p-3 text-slate-200 font-medium">{p.data.cdrsb}</td>
                  <td className="p-3 text-slate-200 font-medium">{p.data.adas_cog13}</td>
                  <td className="p-3 text-amber-300">{p.data.apoe4_allele_count} Copies</td>
                  <td className="p-3">
                    {p.data.mri_available ? (
                      <span className="text-emerald-400 font-medium">Available</span>
                    ) : (
                      <span className="text-slate-500">Missing</span>
                    )}
                  </td>
                  <td className="p-3">
                    {p.data.pet_available ? (
                      <span className="text-purple-400 font-medium">Available</span>
                    ) : (
                      <span className="text-slate-500">Missing</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/assessment/new?preset=${p.id}`}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px]"
                    >
                      Load into Wizard
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DATA DICTIONARY */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="border-b border-slate-700/60 pb-3">
          <h3 className="font-bold text-white text-base">ADNI-Grounded Feature Data Dictionary</h3>
          <p className="text-xs text-slate-400">Standard variable naming convention for ingestion</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3 font-mono">Field Name</th>
                <th className="p-3">Data Type</th>
                <th className="p-3">Expected Range</th>
                <th className="p-3">Clinical Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dataDictionary.map((item) => (
                <tr key={item.field} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-semibold text-cyan-300">{item.field}</td>
                  <td className="p-3 text-slate-400">{item.type}</td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">{item.range}</td>
                  <td className="p-3 text-slate-300">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSTRUCTIONS TO CONNECT REAL ADNI DATA */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="border-b border-slate-700/60 pb-3">
          <h3 className="font-bold text-white text-base">Authorized ADNI Dataset Connection Guide</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            To connect authorized ADNI-1, ADNI-GO, ADNI-2, or ADNI-3 datasets into this framework:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Obtain approved credential access from the ADNI Data and Publications Committee (DPC).</li>
            <li>Download merged clinical tabular files (<code className="text-cyan-300 font-mono">ADNIMERGE.csv</code>).</li>
            <li>Place your preprocessed T1-weighted NIfTI volumes in <code className="text-cyan-300 font-mono">./data/mri/</code>.</li>
            <li>Update <code className="text-cyan-300 font-mono">backend/.env</code> with <code className="text-cyan-300 font-mono">DEMO_MODE=False</code> and <code className="text-cyan-300 font-mono">ADNI_DATA_PATH=./data</code>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
