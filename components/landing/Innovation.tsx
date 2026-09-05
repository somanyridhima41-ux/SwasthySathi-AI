import React from "react";
import { 
  Sparkles, 
  Cpu, 
  Scale, 
  Binary, 
  Smartphone, 
  Check, 
  ShieldCheck, 
  GitBranch 
} from "lucide-react";

export const Innovation = () => {
  return (
    <section className="py-16 sm:py-20 bg-surface border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Innovation</span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            Transparent Rules Today. On-Device Edge ML Tomorrow.
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            Many hackathon prototypes claim complex neural networks that are impossible to verify. 
            We take an honest, engineering-first approach: a 100% deterministic, auditable rules engine in Round 1, 
            architected to support on-device edge ML models in the future mobile wearable companion.
          </p>
        </div>

        {/* 2-Column Innovation Architecture Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Col 1: Round 1 Transparent Rules Engine */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-surface-container shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="font-headline font-bold text-lg text-on-surface">
                    Round 1: Auditable Rules Engine
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-primary bg-surface-container px-2 py-0.5 rounded">
                  Live in lib/riskEngine.ts
                </span>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Rather than trusting a black-box model that can hallucinate dangerous health recommendations, 
                SwasthyaSathi AI uses an open mathematical formulation cross-referencing published clinical thresholds.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container font-mono text-xs text-on-surface space-y-1">
                  <span className="text-outline text-[11px] block">// Mathematical Evaluation Principle:</span>
                  <div>BaseRisk = HeatIndex(T, RH) ⊕ AQI_Breakpoints(PM2.5)</div>
                  <div>Multiplier = AgeCoeff × ExposureLevel</div>
                  <div>FinalTier = EscalateIf(BaseRisk × Multiplier, Sensitivities)</div>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>100% Explainable:</strong> Judges and users can see the exact condition causing the alert.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Zero Hallucination Risk:</strong> Guarantees consistent clinical advice without probabilistic drift.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Pure, Fast, Testable:</strong> Runs in under 1 millisecond on any browser or lightweight processor.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-outline font-mono">
              <span>Status: Fully Implemented &amp; Tested</span>
              <span className="text-primary font-semibold">Web MVP</span>
            </div>
          </div>

          {/* Col 2: Future On-Device Edge ML Architecture */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-surface-container shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="font-headline font-bold text-lg text-on-surface">
                    Future Vision: On-Device Edge ML
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded">
                  Phase 2 Mobile
                </span>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                The current architecture intentionally decouples the environmental ingest, the risk engine, and the UI layer. 
                This ensures that a future React Native / Android client can swap the rules engine for on-device inference without rebuilding the frontend.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-tertiary-fixed/10 border border-tertiary/20 font-mono text-xs text-on-surface space-y-1">
                  <span className="text-outline text-[11px] block">// Target Mobile Sensor Pipelines:</span>
                  <div>• Continuous Photoplethysmography (HRV &amp; Resting Pulse)</div>
                  <div>• Pulse Oximetry (SpO2 Respiratory Decline Tracking)</div>
                  <div>• Skin Temperature Sensor (Micro-Thermal Stress)</div>
                  <div>• 3-Axis Accelerometer (Heat Syncope &amp; Fall Detection)</div>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                    <span><strong>100% Private In-Memory Inference:</strong> Biometric raw waveforms never leave the user&rsquo;s phone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                    <span><strong>Edge Autonomy:</strong> Continues functioning deep inside disaster zones during complete network blackouts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                    <span><strong>Hardware Track Synergy:</strong> Compatible with low-cost BLE wearable bands common in India.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-outline font-mono">
              <span>Status: Architecture-Ready</span>
              <span className="text-tertiary font-semibold">Native Mobile App</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

