import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: "NeuroTriage AI — Explainable Multimodal Alzheimer's Risk Stratification",
  description: "Research prototype engineering an explainable ensemble for Alzheimer's triage with dynamic modality weighting, Owen-value grouped XAI, and clinical decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-[#0B132B] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-white"
        suppressHydrationWarning
      >
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
