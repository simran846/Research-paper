"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Check, 
  X, 
  Brain, 
  Activity, 
  User, 
  FileText, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import { PRESET_PATIENTS } from "@/lib/synthetic-samples";
import { runAssessmentApi } from "@/lib/api";
import { AssessmentInput } from "@/lib/types";

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetId = searchParams.get("preset");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<AssessmentInput>({
    patient_id: "PT-84920",
    age: 72,
    sex: "Female",
    education_years: 16,
    apoe4_allele_count: 1,
    mmse: 23.5,
    cdrsb: 2.5,
    adas_cog13: 18.0,
    memory_score: -0.95,
    executive_func: -0.45,
    language_score: -0.20,
    faq_score: 3.5,
    clinical_available: true,
    mri_available: false,
    pet_available: false,
  });

  const [mriFileName, setMriFileName] = useState<string | null>(null);
  const [petFileName, setPetFileName] = useState<string | null>(null);

  // Load preset or initialize dynamic patient id on mount
  useEffect(() => {
    if (presetId) {
      const found = PRESET_PATIENTS.find((p) => p.id === presetId);
      if (found) {
        setFormData(found.data);
        if (found.data.mri_available) setMriFileName("adni_mri_t1w_sample.nii.gz");
        if (found.data.pet_available) setPetFileName("adni_fdg_pet_sample.nii.gz");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        patient_id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      }));
    }
  }, [presetId]);

  const loadPreset = (presetKey: string) => {
    const found = PRESET_PATIENTS.find((p) => p.id === presetKey);
    if (found) {
      setFormData(found.data);
      if (found.data.mri_available) setMriFileName("adni_mri_t1w_sample.nii.gz");
      else setMriFileName(null);
      if (found.data.pet_available) setPetFileName("adni_fdg_pet_sample.nii.gz");
      else setPetFileName(null);
    }
  };

  const handleMriUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMriFileName(file.name);
      setFormData((prev) => ({ ...prev, mri_available: true }));
    }
  };

  const handlePetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetFileName(file.name);
      setFormData((prev) => ({ ...prev, pet_available: true }));
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setFormData((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (err) {
          alert("Invalid JSON format. Please upload valid patient attributes.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await runAssessmentApi(formData);
      router.push(`/assessment/${result.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute assessment.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Intake & Stratification Wizard
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
            New Patient Assessment
          </h1>
        </div>

        {/* Quick preset loader */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-slate-300">Quick Fill Preset:</span>
          <select
            onChange={(e) => loadPreset(e.target.value)}
            defaultValue=""
            className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="" disabled>Select Demo Case...</option>
            {PRESET_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: 1, title: "1. Demographics & Genetics", icon: User },
          { num: 2, title: "2. Clinical & Cognitive Scores", icon: Activity },
          { num: 3, title: "3. Neuroimaging & Fusion", icon: Brain },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                  : isDone
                  ? "bg-slate-900/60 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900/30 border-slate-800 text-slate-500"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                isActive ? "bg-cyan-500 text-black" : isDone ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-xs font-semibold truncate">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: DEMOGRAPHICS & GENETICS */}
      {step === 1 && (
        <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white">Demographic Profile & Genetic Risk</h3>
            <p className="text-xs text-slate-400">Anonymized patient metadata. No unnecessary personal identifiable information.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Patient Identifier (Anonymized)
              </label>
              <input
                type="text"
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Age (Years): <span className="text-cyan-300 font-bold">{formData.age}</span>
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50 yrs</span>
                <span>72.5 yrs</span>
                <span>95 yrs</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Female", "Male"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, sex: s })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.sex === s
                        ? "bg-blue-600 border-blue-400 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Formal Education (Years): <span className="text-cyan-300 font-bold">{formData.education_years} yrs</span>
              </label>
              <input
                type="range"
                min="6"
                max="24"
                step="1"
                value={formData.education_years}
                onChange={(e) => setFormData({ ...formData, education_years: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Educational attainment acts as a cognitive reserve proxy in the ensemble.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                APOE-ε4 Allele Burden
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: 0, label: "0 Alleles (ε3/ε3 - Baseline)" },
                  { count: 1, label: "1 Allele (Heterozygous ε3/ε4)" },
                  { count: 2, label: "2 Alleles (Homozygous ε4/ε4)" },
                ].map((apoe) => (
                  <button
                    key={apoe.count}
                    type="button"
                    onClick={() => setFormData({ ...formData, apoe4_allele_count: apoe.count })}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      formData.apoe4_allele_count === apoe.count
                        ? "bg-amber-500/20 border-amber-400 text-amber-200"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold block text-white">{apoe.count} ε4 Copies</span>
                    <span className="text-[10px] text-slate-400">{apoe.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Next: Cognitive Battery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLINICAL & COGNITIVE SCORES */}
      {step === 2 && (
        <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Clinical & Cognitive Battery</h3>
              <p className="text-xs text-slate-400">Standardized ADNI neurocognitive assessment scores</p>
            </div>

            {/* JSON / CSV Upload trigger */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON/CSV</span>
              <input type="file" accept=".json,.csv" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* MMSE */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">MMSE (Mini-Mental State Exam)</span>
                <span className="font-bold text-cyan-300">{formData.mmse} / 30</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="0.5"
                value={formData.mmse}
                onChange={(e) => setFormData({ ...formData, mmse: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Normal range: 27-30 | MCI: 22-26 | AD: &lt;21</span>
            </div>

            {/* CDR-SB */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">CDR-SB (Sum of Boxes)</span>
                <span className="font-bold text-cyan-300">{formData.cdrsb} / 18</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={formData.cdrsb}
                onChange={(e) => setFormData({ ...formData, cdrsb: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Normal: 0 | Early MCI: 0.5-2.5 | Late MCI: 2.5-4.5</span>
            </div>

            {/* ADAS-Cog 13 */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">ADAS-Cog 13</span>
                <span className="font-bold text-cyan-300">{formData.adas_cog13} / 85</span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                step="0.5"
                value={formData.adas_cog13}
                onChange={(e) => setFormData({ ...formData, adas_cog13: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Normal: 4-11 | MCI: 12-25 | AD: &gt;25</span>
            </div>

            {/* FAQ Functional Activities */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">FAQ (Functional Activities Score)</span>
                <span className="font-bold text-cyan-300">{formData.faq_score} / 30</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={formData.faq_score}
                onChange={(e) => setFormData({ ...formData, faq_score: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Daily living independence: 0-1 Normal | &gt;5 Impairment</span>
            </div>

            {/* Memory Composite Z-score */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Standardized Memory Composite (Z)</span>
                <span className="font-bold text-cyan-300">{formData.memory_score.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.5"
                max="2.0"
                step="0.05"
                value={formData.memory_score}
                onChange={(e) => setFormData({ ...formData, memory_score: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Normal: &gt;0.5 | MCI: -0.5 to -1.5 | AD: &lt;-1.8</span>
            </div>

            {/* Executive Function Composite */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Executive Function Composite (Z)</span>
                <span className="font-bold text-cyan-300">{formData.executive_func.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="2.0"
                step="0.05"
                value={formData.executive_func}
                onChange={(e) => setFormData({ ...formData, executive_func: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Normal: &gt;0.4 | MCI: -0.4 to -1.2 | AD: &lt;-1.5</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Next: Neuroimaging Upload & Detection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: NEUROIMAGING & LIVE MODALITY DETECTION */}
      {step === 3 && (
        <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white">Neuroimaging & Modality Availability Detection</h3>
            <p className="text-xs text-slate-400">
              Optional MRI/PET scan uploads. The system automatically adapts weights if imaging is missing.
            </p>
          </div>

          {/* Modality Status Overview Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Clinical Data:</span>
                <span className="text-[11px] text-emerald-300">Available (100% Active)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${formData.mri_available ? "bg-cyan-400" : "bg-slate-600"}`} />
              <div>
                <span className="text-xs font-semibold text-white block">Structural MRI:</span>
                <span className={`text-[11px] ${formData.mri_available ? "text-cyan-300" : "text-slate-400"}`}>
                  {formData.mri_available ? "Uploaded (Active)" : "Not Available (Missing)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${formData.pet_available ? "bg-purple-400" : "bg-slate-600"}`} />
              <div>
                <span className="text-xs font-semibold text-white block">Metabolic PET:</span>
                <span className={`text-[11px] ${formData.pet_available ? "text-purple-300" : "text-slate-400"}`}>
                  {formData.pet_available ? "Uploaded (Active)" : "Not Available (Missing)"}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Dropzones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* MRI Dropzone */}
            <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
              formData.mri_available ? "bg-cyan-950/20 border-cyan-500" : "bg-slate-900/60 border-slate-700"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>Structural 3D MRI</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, mri_available: !prev.mri_available }));
                    if (formData.mri_available) setMriFileName(null);
                    else setMriFileName("simulated_mri_t1.nii.gz");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded font-semibold cursor-pointer ${
                    formData.mri_available ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {formData.mri_available ? "Toggle Off" : "Simulate Sample MRI"}
                </button>
              </div>

              <label className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-cyan-400/80 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  {mriFileName ? mriFileName : "Upload MRI (.nii, .nii.gz, .png)"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">NIfTI or axial slice demonstration image</span>
                <input type="file" accept=".nii,.gz,.png,.jpg" onChange={handleMriUpload} className="hidden" />
              </label>
            </div>

            {/* PET Dropzone */}
            <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
              formData.pet_available ? "bg-purple-950/20 border-purple-500" : "bg-slate-900/60 border-slate-700"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Metabolic FDG/Amyloid PET</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, pet_available: !prev.pet_available }));
                    if (formData.pet_available) setPetFileName(null);
                    else setPetFileName("simulated_fdg_pet.nii.gz");
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded font-semibold cursor-pointer ${
                    formData.pet_available ? "bg-purple-500/20 text-purple-300" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {formData.pet_available ? "Toggle Off" : "Simulate Sample PET"}
                </button>
              </div>

              <label className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-purple-400/80 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  {petFileName ? petFileName : "Upload PET (.nii, .nii.gz, .png)"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">FDG / Amyloid metabolic tracer scan</span>
                <input type="file" accept=".nii,.gz,.png,.jpg" onChange={handlePetUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Dynamic Weight Live Preview Notice */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Dynamic Fusion Weight Estimation:</strong>
              {!formData.mri_available && !formData.pet_available ? (
                <span>
                  Imaging is missing. The engine will allocate <strong className="text-cyan-300">100% weight to Tabular Clinical</strong> data and calibrate uncertainty.
                </span>
              ) : formData.mri_available && formData.pet_available ? (
                <span>
                  Full Multimodal Active. Weights will balance <strong className="text-cyan-300">40% Clinical, 35% MRI, 25% PET</strong> for comprehensive trajectory modeling.
                </span>
              ) : (
                <span>
                  Partial imaging active. Weights will dynamically re-balance without zero-imputation hallucinations.
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Running Multimodal Ensemble...</span>
              ) : (
                <>
                  <span>Run NeuroTriage Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Assessment Wizard...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}
