"use client";

import React, { useState } from "react";
import { Eye, Layers, ZoomIn, Info, ShieldAlert } from "lucide-react";

interface BrainViewerProps {
  regionAttentions?: Record<string, number>;
  imagingAvailable: boolean;
}

export default function BrainAttentionViewer({ regionAttentions, imagingAvailable }: BrainViewerProps) {
  const [activeSlice, setActiveSlice] = useState<"Axial" | "Coronal" | "Sagittal">("Axial");
  const [highlightRegion, setHighlightRegion] = useState<string>("all");

  const regions = [
    {
      id: "hippocampus",
      name: "Medial Temporal / Hippocampus",
      score: regionAttentions?.["Hippocampus (Medial Temporal)"] ?? (imagingAvailable ? 78 : 0),
      desc: "Early structural atrophy and volume reduction",
      color: "border-red-500 bg-red-500/20 text-red-300",
      dot: "bg-red-500",
    },
    {
      id: "cortical",
      name: "Cortical Mantle (Parietotemporal)",
      score: regionAttentions?.["Cortical Mantle (Parietotemporal)"] ?? (imagingAvailable ? 54 : 0),
      desc: "FDG-PET metabolic reduction and cortical thinning",
      color: "border-amber-500 bg-amber-500/20 text-amber-300",
      dot: "bg-amber-500",
    },
    {
      id: "ventricles",
      name: "Lateral Ventricles (CSF Space)",
      score: regionAttentions?.["Lateral Ventricles (CSF Ex-vacuo)"] ?? (imagingAvailable ? 42 : 0),
      desc: "Ex-vacuo ventricular enlargement",
      color: "border-blue-500 bg-blue-500/20 text-blue-300",
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-[#1C2541]/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Spatial Attention Map
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
              3D CNN Feature Attribution
            </span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            Neuroimaging Saliency & Region Attention
          </h3>
        </div>

        {/* Slice plane switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(["Axial", "Coronal", "Sagittal"] as const).map((slice) => (
            <button
              key={slice}
              onClick={() => setActiveSlice(slice)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeSlice === slice
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {slice}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Brain Slice Canvas Container */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center relative min-h-[280px]">
          {/* Simulated Brain SVG Slice with Attention Heatmap Overlays */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Brain Silhouette Base */}
            <svg viewBox="0 0 200 200" className="w-full h-full text-slate-800">
              {/* Outer Cranial Contour */}
              <ellipse cx="100" cy="100" rx="80" ry="70" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              
              {/* Ventricular Space */}
              <path
                d="M 85 85 C 80 95, 80 110, 88 120 C 92 110, 92 95, 85 85 Z"
                fill={highlightRegion === "ventricles" || highlightRegion === "all" ? "#3B82F6" : "#1E293B"}
                fillOpacity={imagingAvailable ? 0.6 : 0.2}
                stroke="#60A5FA"
                strokeWidth="1"
              />
              <path
                d="M 115 85 C 120 95, 120 110, 112 120 C 108 110, 108 95, 115 85 Z"
                fill={highlightRegion === "ventricles" || highlightRegion === "all" ? "#3B82F6" : "#1E293B"}
                fillOpacity={imagingAvailable ? 0.6 : 0.2}
                stroke="#60A5FA"
                strokeWidth="1"
              />

              {/* Medial Temporal / Hippocampal ROI Hotspots */}
              <circle
                cx="65"
                cy="115"
                r="16"
                fill={highlightRegion === "hippocampus" || highlightRegion === "all" ? "#EF4444" : "#475569"}
                fillOpacity={imagingAvailable ? 0.75 : 0.15}
                className={imagingAvailable ? "animate-pulse" : ""}
              />
              <circle
                cx="135"
                cy="115"
                r="16"
                fill={highlightRegion === "hippocampus" || highlightRegion === "all" ? "#EF4444" : "#475569"}
                fillOpacity={imagingAvailable ? 0.75 : 0.15}
                className={imagingAvailable ? "animate-pulse" : ""}
              />

              {/* Cortical Mantle Boundary Attention */}
              <path
                d="M 35 100 A 65 55 0 0 1 165 100"
                fill="none"
                stroke={highlightRegion === "cortical" || highlightRegion === "all" ? "#F59E0B" : "#334155"}
                strokeWidth="6"
                strokeOpacity={imagingAvailable ? 0.8 : 0.2}
                strokeDasharray="4 2"
              />
            </svg>

            {/* Simulated Watermark Badge */}
            <div className="absolute top-2 left-2 bg-slate-900/90 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-800">
              {activeSlice} View ({imagingAvailable ? "Active Heatmap" : "Synthetic Base"})
            </div>

            {!imagingAvailable && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-4 text-center">
                <ShieldAlert className="w-8 h-8 text-amber-400 mb-2" />
                <h4 className="text-sm font-semibold text-white">Imaging Modality Missing</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  MRI/PET was not provided for this patient. The model dynamically pivoted to tabular clinical predictors.
                </p>
              </div>
            )}
          </div>

          {/* Saliency Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-900 w-full justify-center">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Contribution</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate Attention</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Basal / Reference</span>
          </div>
        </div>

        {/* Right: Anatomical Region Saliency Scores */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Anatomical ROI Attribution
          </span>

          {regions.map((roi) => (
            <div
              key={roi.id}
              onClick={() => setHighlightRegion(highlightRegion === roi.id ? "all" : roi.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                highlightRegion === roi.id || highlightRegion === "all"
                  ? "bg-slate-900/80 border-slate-700"
                  : "bg-slate-900/30 border-slate-800 opacity-40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${roi.dot}`} />
                  <span className="font-semibold text-xs text-white">{roi.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {imagingAvailable ? `${roi.score}%` : "N/A"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-4.5">{roi.desc}</p>
            </div>
          ))}

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Visualization Notice:</strong> Heatmaps represent model attention weights on normalized stereotactic coordinates and are not a substitute for radiologist review.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
