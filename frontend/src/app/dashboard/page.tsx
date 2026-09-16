"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  Layers,
  Sparkles,
  Search,
  Filter,
  Bot,
  Play,
  Zap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { listAssessmentsApi } from "@/lib/api";
import { AssessmentData } from "@/lib/types";
import { PRESET_PATIENTS } from "@/lib/synthetic-samples";
import NeuroTriageAssistantModal from "@/components/NeuroTriageAssistantModal";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listAssessmentsApi(60);
        setAssessments(data);
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const totalCount = assessments.length;
  const highRiskCount = assessments.filter((a) => a.risk_level === "High" || a.risk_level === "Severe").length;
  const modRiskCount = assessments.filter((a) => a.risk_level === "Moderate").length;
  const lowRiskCount = assessments.filter((a) => a.risk_level === "Low").length;
  const imagingAvailableCount = assessments.filter((a) => a.modalities.mri || a.modalities.pet).length;
  const missingModalityCount = assessments.filter((a) => !a.modalities.mri && !a.modalities.pet).length;

  // Trajectory distribution
  const trajectoryCounts: Record<string, number> = {
    "Normal Aging": 0,
    "Early MCI": 0,
    "Late MCI": 0,
    "Alzheimer's Disease": 0,
  };
  assessments.forEach((a) => {
    if (trajectoryCounts[a.trajectory_stage] !== undefined) {
      trajectoryCounts[a.trajectory_stage]++;
    }
  });

  const trajectoryChartData = [
    { name: "Normal Aging", count: trajectoryCounts["Normal Aging"], fill: "#10B981" },
    { name: "Early MCI", count: trajectoryCounts["Early MCI"], fill: "#06B6D4" },
    { name: "Late MCI", count: trajectoryCounts["Late MCI"], fill: "#F59E0B" },
    { name: "AD", count: trajectoryCounts["Alzheimer's Disease"], fill: "#EF4444" },
  ];

  // Risk Pie Chart Data
  const riskPieData = [
    { name: "Low Risk", value: lowRiskCount, color: "#10B981" },
    { name: "Moderate Risk", value: modRiskCount, color: "#06B6D4" },
    { name: "High / Severe Risk", value: highRiskCount, color: "#EF4444" },
  ];

  // Filtered recent assessments
  const filteredList = assessments.filter((a) => {
    const matchRisk = filterRisk === "all" || a.risk_level.toLowerCase() === filterRisk.toLowerCase();
    const matchSearch =
      a.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.trajectory_stage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRisk && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Clinical Decision Support
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ADNI Cohort Connected
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">
            Clinician Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multimodal risk stratification, dynamic weighting status, and patient trajectory monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAssistantOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 shadow-sm transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Ask NeuroTriage Assistant</span>
          </button>

          <Link
            href="/assessment/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-slate-700 shadow-md">
          <span className="text-xs text-slate-400 block">Total Assessments</span>
          <span className="text-2xl font-bold text-white mt-1 block">{loading ? "..." : totalCount}</span>
          <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">Active Registry</span>
        </div>

        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-rose-500/30 shadow-md">
          <span className="text-xs text-slate-400 block">High Risk</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">{loading ? "..." : highRiskCount}</span>
          <span className="text-[10px] text-rose-300/80 mt-1 block">Late MCI / AD</span>
        </div>

        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-amber-500/30 shadow-md">
          <span className="text-xs text-slate-400 block">Moderate Risk</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{loading ? "..." : modRiskCount}</span>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Early MCI</span>
        </div>

        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-emerald-500/30 shadow-md">
          <span className="text-xs text-slate-400 block">Low Risk</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{loading ? "..." : lowRiskCount}</span>
          <span className="text-[10px] text-emerald-300/80 mt-1 block">Normal Aging</span>
        </div>

        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-cyan-500/30 shadow-md">
          <span className="text-xs text-slate-400 block">Imaging Available</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block">{loading ? "..." : imagingAvailableCount}</span>
          <span className="text-[10px] text-cyan-300/80 mt-1 block">MRI / PET Present</span>
        </div>

        <div className="bg-[#1C2541]/90 p-4 rounded-xl border border-purple-500/30 shadow-md">
          <span className="text-xs text-slate-400 block">Missing Modality</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 block">{loading ? "..." : missingModalityCount}</span>
          <span className="text-[10px] text-purple-300/80 mt-1 block">Dynamically Adapted</span>
        </div>
      </div>

      {/* QUICK DEMO PATIENTS LAUNCHER STRIP */}
      <div className="bg-gradient-to-r from-blue-950/40 via-[#1C2541] to-cyan-950/40 rounded-2xl p-5 border border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Dynamic Modality Weighting Demo Cases</h3>
          </div>
          <span className="text-xs text-slate-400">1-Click evaluate dynamic fusion behaviors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_PATIENTS.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              href={`/assessment/new?preset=${p.id}`}
              className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {p.name.split("—")[0]}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {p.tag}
                </span>
              </div>
              <Play className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Diagnostic Trajectory Distribution */}
        <div className="lg:col-span-7 bg-[#1C2541]/90 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Diagnostic Trajectory Distribution</h3>
              <p className="text-xs text-slate-400">Cohort progression across the 4 stages</p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">N = {totalCount}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {trajectoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Risk Stratification Donut */}
        <div className="lg:col-span-5 bg-[#1C2541]/90 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="font-bold text-white text-base">Risk Stratification Breakdown</h3>
            <p className="text-xs text-slate-400">Low vs Moderate vs High Risk Triage</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-700/60">
            <div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1" />
              <span className="text-slate-300">Low</span>
              <span className="block font-bold text-white">{lowRiskCount}</span>
            </div>
            <div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block mr-1" />
              <span className="text-slate-300">Moderate</span>
              <span className="block font-bold text-white">{modRiskCount}</span>
            </div>
            <div>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mr-1" />
              <span className="text-slate-300">High</span>
              <span className="block font-bold text-white">{highRiskCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ASSESSMENTS TABLE */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <h3 className="font-bold text-white text-base">Recent Patient Assessments</h3>
            <p className="text-xs text-slate-400">View diagnostic predictions, dynamic weights, and triage recommendations</p>
          </div>

          {/* Search and Risk Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient ID or stage..."
                className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
              <option value="severe">Severe Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Predicted Trajectory</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Modalities Active</th>
                <th className="p-3">Triage Recommendation</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredList.slice(0, 15).map((a) => {
                const isHigh = a.risk_level === "High" || a.risk_level === "Severe";
                const isMod = a.risk_level === "Moderate";

                return (
                  <tr key={a.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-cyan-300">
                      {a.patient_id}
                    </td>

                    <td className="p-3 font-medium text-white">
                      {a.trajectory_stage}
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-200">
                        {Math.round(a.confidence * 100)}%
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isHigh
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : isMod
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {a.risk_level}
                      </span>
                    </td>

                    <td className="p-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px]">
                          Clin: {Math.round(a.dynamic_weights.clinical * 100)}%
                        </span>
                        {a.modalities.mri ? (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 text-[10px]">
                            MRI
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                            No MRI
                          </span>
                        )}
                        {a.modalities.pet && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px]">
                            PET
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-slate-400 max-w-xs truncate" title={a.triage.title}>
                      {a.triage.title}
                    </td>

                    <td className="p-3 text-right">
                      <Link
                        href={`/assessment/${a.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-cyan-300 hover:text-white border border-blue-500/30 transition-all font-medium text-[11px]"
                      >
                        <span>View XAI</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No assessments matched the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <NeuroTriageAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}
