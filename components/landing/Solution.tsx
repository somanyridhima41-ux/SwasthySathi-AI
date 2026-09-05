"use client";

import React, { useState } from "react";
import { 
  CloudSun, 
  MapPin, 
  UserCheck, 
  Cpu, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle,
  Database,
  Lock,
  HeartPulse,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogicStep {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortDesc: string;
  details: string[];
  privacyOrTech: string;
  round1Impl: string;
  futureVision: string;
}

const LOGIC_STEPS: LogicStep[] = [
  {
    id: 1,
    label: "Environmental Telemetry",
    icon: CloudSun,
    shortDesc: "Real-time atmospheric & particulate ingestion",
    details: [
      "Live ambient temperature & solar radiation",
      "Calculated &lsquo;Feels-Like&rsquo; and Wet-Bulb humidity indices",
      "Real-time PM2.5, PM10, and Ozone AQI concentrations",
    ],
    privacyOrTech: "Keyless public APIs (Open-Meteo) with zero user tracking",
    round1Impl: "Live Weather & AQI API adapter querying hyper-local points",
    futureVision: "Combined satellite meteorological feeds + micro-station feeds",
  },
  {
    id: 2,
    label: "Hyper-Local Coordinates",
    icon: MapPin,
    shortDesc: "Precise latitude/longitude resolution",
    details: [
      "Browser Geolocation API with explicit permission prompt",
      "Instant manual search fallback for Indian cities & districts",
      "Elevation & local microclimate urban heat island factor",
    ],
    privacyOrTech: "Coordinates stored only in ephemeral memory on-device",
    round1Impl: "Browser GPS prompt + manual autocomplete fallback selector",
    futureVision: "Continuous geofencing for real-time disaster boundary entry",
  },
  {
    id: 3,
    label: "Personal Profile",
    icon: UserCheck,
    shortDesc: "Vulnerability parameters without raw medical history",
    details: [
      "Age bracket (Under 18, 18–40, 41–60, 60+)",
      "Daily outdoor exposure level (Low indoors vs High field labor)",
      "Targeted sensitivities: Heat, Cardiovascular, Respiratory",
    ],
    privacyOrTech: "Data minimization: zero medical records or diagnosis history",
    round1Impl: "Local-first client storage + optional encrypted cloud backup",
    futureVision: "Encrypted on-device health profile synced via secure enclave",
  },
  {
    id: 4,
    label: "Deterministic Risk Engine",
    icon: Cpu,
    shortDesc: "Transparent multi-factor clinical evaluation",
    details: [
      "Pure, testable mathematical function (lib/riskEngine.ts)",
      "Cross-multiplies thermal index and particulate strain against sensitivities",
      "100% explainable rules — zero AI hallucination or black-box drift",
    ],
    privacyOrTech: "Executed purely in-client; no sensitive inputs leave the device",
    round1Impl: "Deterministic rules engine evaluating threshold escalations",
    futureVision: "Edge ML model performing predictive on-device inference",
  },
  {
    id: 5,
    label: "Graded Health Risk & Advice",
    icon: AlertTriangle,
    shortDesc: "Low, Moderate, High, or Critical health categorization",
    details: [
      "Color-coded clinical risk severity badge",
      "One-sentence plain-language primary cause explanation",
      "2 to 4 concrete preventive interventions (hydration, shelter, pacing)",
    ],
    privacyOrTech: "Clinically framed actionable advice, not generic platitudes",
    round1Impl: "Interactive dashboard card with dynamic warning advisories",
    futureVision: "Adaptive push alerts triggered before physiological symptoms occur",
  },
  {
    id: 6,
    label: "User Action & SOS Fail-Safe",
    icon: ShieldAlert,
    shortDesc: "Empowering user prevention + emergency coordinates",
    details: [
      "Self-care execution: Electrolyte rehydration, shaded retreat",
      "Simulated emergency SOS trigger with exact GPS coordinates",
      "Direct rapid contact link for designated emergency caregiver",
    ],
    privacyOrTech: "Explicit simulated SOS copy — honest about hackathon scope",
    round1Impl: "One-touch SOS dialog broadcasting location & designated contact",
    futureVision: "Automated fall detection & automated cellular SOS dispatch",
  },
];

export const Solution = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = LOGIC_STEPS[activeStepIndex];

  return (
    <section className="py-16 sm:py-20 bg-surface border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Core Logic Chain Architecture</span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            The Solution: A Transparent 6-Stage Personal Health Engine
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            SwasthyaSathi AI does not guess or hallucinate. Every recommendation is produced by a transparent, 
            deterministic pipeline that transforms environmental telemetry into personal protective action.
          </p>
        </div>

        {/* Horizontal Stepper Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {LOGIC_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  "p-3 rounded-xl text-left border transition-all flex flex-col justify-between relative",
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-on-surface border-surface-container hover:bg-surface-container-low"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
                    isSelected ? "bg-primary-container text-white" : "bg-surface-container text-outline"
                  )}>
                    {step.id}
                  </span>
                  <Icon className={cn("w-4 h-4", isSelected ? "text-primary-fixed" : "text-primary")} />
                </div>
                <div>
                  <span className="text-xs font-bold font-headline block leading-tight">
                    {step.label}
                  </span>
                  <span className={cn(
                    "text-[10px] mt-1 line-clamp-1 block",
                    isSelected ? "text-primary-fixed" : "text-outline"
                  )}>
                    {step.shortDesc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-container shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Stage Information */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  {React.createElement(activeStep.icon, { className: "w-6 h-6 text-primary" })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-outline">
                      Stage 0{activeStep.id} of 06
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                      Core IP
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">
                    {activeStep.label}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {activeStep.shortDesc}
              </p>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                  Key Processing Steps:
                </span>
                <div className="space-y-2">
                  {activeStep.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Safeguard */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-2.5 text-xs text-on-surface-variant mt-4">
                <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>
                  <strong>Privacy Architecture:</strong> {activeStep.privacyOrTech}
                </span>
              </div>
            </div>

            {/* Right: Round 1 vs Future Edge Vision */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl p-5 bg-surface-container-low/80 border border-surface-container space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
                  <Database className="w-4 h-4 text-primary" />
                  <span>Round 1 Implementation (Current MVP)</span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {activeStep.round1Impl}
                </p>
              </div>

              <div className="rounded-xl p-5 bg-tertiary-fixed/20 border border-tertiary/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-tertiary uppercase">
                  <Smartphone className="w-4 h-4 text-tertiary" />
                  <span>Future Roadmap (Native Mobile &amp; Edge AI)</span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {activeStep.futureVision}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Summary Flow Banner */}
        <div className="rounded-xl p-4 sm:p-5 bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-primary-fixed flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold font-headline block">The Core Principle of SIH Problem Statement 26181:</span>
              <span className="text-white/80">
                Weather + Location + Personal Profile = Actionable Health Prevention
              </span>
            </div>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary text-xs font-bold hover:bg-surface-container transition-colors flex-shrink-0 shadow-sm"
          >
            <span>See the Engine in Action</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

