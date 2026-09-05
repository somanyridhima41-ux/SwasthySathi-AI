import React from "react";
import { 
  HeartPulse, 
  Wind, 
  CheckSquare, 
  Radio, 
  WifiOff, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export const Features = () => {
  const features = [
    {
      icon: HeartPulse,
      title: "Personalized Risk Classification",
      description: "Replaces generic city-wide alerts with a tailored risk tier (Low, Moderate, High, Critical) computed from your age, exposure habits, and personal climate sensitivities.",
      badge: "Core IP",
    },
    {
      icon: Wind,
      title: "Hyper-Local Atmospheric Telemetry",
      description: "Direct integration with high-resolution weather and air quality APIs to track wet-bulb temperature, heat index, humidity, wind, and PM2.5/PM10 particulate levels.",
      badge: "Live Data",
    },
    {
      icon: CheckSquare,
      title: "Actionable Preventive Protocols",
      description: "Generates 2 to 4 plain-language preventive actions: exact hourly hydration volumes, mandatory shaded rest intervals, and peak sun avoidance windows.",
      badge: "Clinical Triage",
    },
    {
      icon: Radio,
      title: "One-Touch Emergency SOS Fail-Safe",
      description: "Rapid one-click emergency broadcast dialog displaying live GPS coordinates and your designated emergency contact for urgent escalation during heat exhaustion.",
      badge: "Safety",
    },
    {
      icon: WifiOff,
      title: "Low-Connectivity Simulation",
      description: "Resilient caching architecture designed for intermittent network coverage during extreme weather events, displaying last-verified readings with clear timestamp badges.",
      badge: "Resilience",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Knowledge Data Minimization",
      description: "Requires no hospital records, diagnosis history, or biometric identity. All personal parameters remain on your local device with zero third-party profiling.",
      badge: "Privacy",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-primary font-semibold">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Engineered for Resilience</span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            Key Capabilities Built for Life-Saving Early Warning
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            Every feature in SwasthyaSathi AI directly addresses Problem Statement 26181: delivering reliable, 
            privacy-preserving health protection without unneeded bells and whistles.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-surface-container-lowest border border-surface-container shadow-xs hover:border-primary/40 interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-container font-semibold text-outline">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-surface-container flex items-center text-xs text-primary font-semibold">
                  <span>Explore in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

