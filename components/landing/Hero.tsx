"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Thermometer, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Cpu,
  HeartPulse,
  Droplets,
  Flame,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

type DemoProfile = {
  id: string;
  name: string;
  role: string;
  age: string;
  exposure: string;
  sensitivities: string[];
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  riskBadgeColor: string;
  riskBgColor: string;
  riskTextColor: string;
  primaryDriver: string;
  recommendations: string[];
};

const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "senior",
    name: "Elderly Citizen",
    role: "Retired resident",
    age: "71 years",
    exposure: "Low (Indoors)",
    sensitivities: ["Cardiovascular strain", "Heat sensitivity"],
    riskLevel: "Critical",
    riskBadgeColor: "bg-red-600",
    riskBgColor: "bg-red-50 border-red-200",
    riskTextColor: "text-red-900",
    primaryDriver: "Combined 38°C ambient heat & elevated PM2.5 forces compensatory cardiac workload and vascular dilation risk.",
    recommendations: [
      "Maintain active air-conditioning / cool indoor refuge",
      "Monitor resting pulse every 3 hours; alert caregiver if >95 BPM",
      "Consume cool oral fluids at 250 mL/hr even without thirst",
    ],
  },
  {
    id: "worker",
    name: "Outdoor Construction Worker",
    role: "Daily site labor",
    age: "34 years",
    exposure: "High (Sun & Traffic)",
    sensitivities: ["None declared"],
    riskLevel: "High",
    riskBadgeColor: "bg-orange-600",
    riskBgColor: "bg-orange-50 border-orange-200",
    riskTextColor: "text-orange-900",
    primaryDriver: "Wet-bulb globe temperature and prolonged direct solar insolation create severe acute dehydration & heat-cramp hazards.",
    recommendations: [
      "Mandatory shaded rest intervals every 25 minutes",
      "Drink 1 liter of electrolyte solution per 2 hours of physical exertion",
      "Halt strenuous lifting between 12:00 PM and 3:30 PM",
    ],
  },
  {
    id: "student",
    name: "Healthy Young Adult",
    role: "University student",
    age: "22 years",
    exposure: "Moderate (Commuting)",
    sensitivities: ["None declared"],
    riskLevel: "Moderate",
    riskBadgeColor: "bg-amber-600",
    riskBgColor: "bg-amber-50 border-amber-200",
    riskTextColor: "text-amber-900",
    primaryDriver: "Elevated AQI (185) induces mucosal membrane irritation during outdoor transit, but thermoregulation remains intact.",
    recommendations: [
      "Shift outdoor cardiovascular workouts to indoor gyms",
      "Wear particulate-rated mask (N95) during motorized commute",
      "Baseline hydration target adjusted to 2.8 liters today",
    ],
  },
];

export const Hero = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>("senior");

  const activeProfile = DEMO_PROFILES.find((p) => p.id === selectedProfileId) || DEMO_PROFILES[0];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle atmospheric gradient accents */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-fixed/20 via-surface/10 to-transparent pointer-events-none -z-10 blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Mission & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
            {/* SIH Track Banner */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-primary font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Smart India Hackathon 2026 • Problem Statement 26181</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight leading-[1.15]">
              Generic weather gives you numbers.{" "}
              <span className="text-primary underline decoration-primary-dim decoration-4 underline-offset-4">
                SwasthyaSathi AI
              </span>{" "}
              gives you personal survival intelligence.
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
              A standard <span className="font-semibold text-on-surface">38°C & AQI 185</span> advisory is too vague to prevent medical emergencies. 
              Our privacy-preserving risk engine cross-references real-time atmospheric hazards with your age, outdoor exposure, and physiological sensitivities 
              to compute your exact clinical risk tier before symptoms escalate.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-base shadow-sm hover:bg-primary-container transition-all active:scale-[0.98]"
              >
                <HeartPulse className="w-5 h-5 text-primary-fixed" />
                <span>Launch Live Companion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-on-surface border border-surface-container-high font-semibold text-base shadow-xs hover:bg-surface-container-low transition-all active:scale-[0.98]"
              >
                <Sliders className="w-4 h-4 text-outline" />
                <span>Configure Health Profile</span>
              </Link>
            </div>

            {/* Trust & Architecture Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-surface-container/80 text-xs text-on-surface-variant font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Zero Medical History Stored</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Deterministic Rules Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>On-Device Edge ML Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Risk Personalization Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-container shadow-md relative overflow-hidden">
              
              {/* Header with live scenario condition */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <span className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
                    The Personalization Difference
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-low text-outline">
                  Sample: New Delhi Summer
                </span>
              </div>

              {/* Shared Generic Environmental Input */}
              <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-600" />
                  <span className="text-on-surface-variant">Ambient Weather:</span>
                  <span className="font-semibold text-on-surface font-mono">38°C (Feels 43°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-tertiary" />
                  <span className="text-on-surface-variant">Air Quality Index:</span>
                  <span className="font-semibold text-on-surface font-mono">185 AQI (Unhealthy)</span>
                </div>
              </div>

              {/* Profile Selector Tabs */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2">
                  Select a User Profile to Compare Personal Risk:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_PROFILES.map((profile) => {
                    const isSelected = profile.id === selectedProfileId;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => setSelectedProfileId(profile.id)}
                        className={cn(
                          "px-2.5 py-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between",
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20"
                            : "bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low"
                        )}
                      >
                        <span className="font-semibold truncate block">{profile.name}</span>
                        <span className={cn(
                          "text-[10px] mt-0.5 truncate block",
                          isSelected ? "text-primary-fixed" : "text-outline"
                        )}>
                          {profile.age} • {profile.exposure.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Risk Output Card */}
              <div className={cn("mt-5 p-4 rounded-xl border transition-all duration-300", activeProfile.riskBgColor)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-outline">
                      Calculated Personal Risk:
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-white text-xs font-bold font-mono tracking-wide uppercase",
                      activeProfile.riskBadgeColor
                    )}>
                      {activeProfile.riskLevel} Risk
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-outline">
                    ID: {activeProfile.id.toUpperCase()}
                  </span>
                </div>

                {/* Primary Driver */}
                <p className={cn("text-xs sm:text-sm font-medium leading-relaxed mb-3", activeProfile.riskTextColor)}>
                  {activeProfile.primaryDriver}
                </p>

                {/* Plain-Language Recommendations */}
                <div className="space-y-1.5 pt-2 border-t border-black/10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-outline block">
                    Immediate Tailored Protocol:
                  </span>
                  {activeProfile.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">
                  Evaluated via <strong className="text-on-surface">lib/riskEngine.ts</strong> rules
                </span>
                <Link
                  href="/dashboard"
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Test with live GPS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

