"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  PlusCircle, 
  Users, 
  Cpu, 
  BarChart3, 
  Layers, 
  Database, 
  Bot,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import NeuroTriageAssistantModal from "./NeuroTriageAssistantModal";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Activity },
    { label: "New Assessment", href: "/assessment/new", icon: PlusCircle },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Explainability", href: "/explainability", icon: Cpu },
    { label: "Model Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Ablation Study", href: "/ablation", icon: Layers },
    { label: "ADNI Dataset", href: "/dataset", icon: Database },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white tracking-tight">NeuroTriage</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                      AI v1.0
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block -mt-0.5">
                    Explainable Multimodal Risk Stratification
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: AI Assistant Button */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setAssistantOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium border border-cyan-400/30 shadow-md shadow-cyan-900/20 transition-all hover:scale-102 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setAssistantOpen(true)}
                className="p-2 rounded-lg bg-blue-600/30 text-cyan-300 border border-cyan-500/30"
              >
                <Bot className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1C2541] border-b border-slate-700 px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-blue-600/30 text-blue-400 border border-blue-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* AI Research Assistant Modal */}
      <NeuroTriageAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </>
  );
}
