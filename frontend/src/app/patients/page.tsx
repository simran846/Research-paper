"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, PlusCircle, ArrowUpRight, Activity, Calendar, ShieldCheck, User } from "lucide-react";
import { listPatientsApi } from "@/lib/api";
import { PatientRecord } from "@/lib/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await listPatientsApi();
        setPatients(res);
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.patient_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Cohort Registry
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">
            Patients & Longitudinal Records
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active patient profiles, demographic baselines, and assessment tracking.
          </p>
        </div>

        <Link
          href="/assessment/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      {/* Patient Search & Table */}
      <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient ID..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredPatients.length} Patients Enrolled
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading patient records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Biological Sex</th>
                  <th className="p-3">Formal Education</th>
                  <th className="p-3">APOE-ε4 Carrier Burden</th>
                  <th className="p-3">Enrolled Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-semibold text-cyan-300">
                      {p.patient_id}
                    </td>
                    <td className="p-3 text-white font-medium">{p.age} yrs</td>
                    <td className="p-3 text-slate-300">{p.sex}</td>
                    <td className="p-3 text-slate-300">{p.education_years} yrs</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.apoe4_allele_count > 0 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-400"
                      }`}>
                        {p.apoe4_allele_count} Allele(s)
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]" suppressHydrationWarning>
                      {p.created_at ? p.created_at.slice(0, 10) : "2026-09-16"}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/assessment/new?patient_id=${p.patient_id}&age=${p.age}&sex=${p.sex}&education=${p.education_years}&apoe=${p.apoe4_allele_count}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-cyan-300 hover:text-white border border-blue-500/30 text-[11px] font-medium transition-all"
                      >
                        <span>New Test</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No patients found matching the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
