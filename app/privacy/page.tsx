import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Compass, 
  Cpu, 
  Database, 
  CheckCircle2, 
  ArrowLeft,
  FileCheck,
  AlertCircle
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface py-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-4 mb-10 pb-8 border-b border-surface-container">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-primary font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture &amp; Ethics</span>
          </div>
          
          <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Privacy Architecture &amp; Data Minimization
          </h1>
          
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            SwasthyaSathi AI is engineered around a core ethical commitment: delivering early-warning health intelligence without creating centralized honeypots of sensitive medical data.
          </p>
        </div>

        <div className="space-y-10">
          
          {/* Principle 1: Data Minimization */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface">
                1. Data Minimization by Design
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              We explicitly collect only the mathematical multipliers necessary to calculate heat index and particulate strain escalation. We do not ask for, record, or infer clinical diagnoses, hospital records, prescription regimens, insurance identifiers, or government IDs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 uppercase font-mono">
                  <EyeOff className="w-4 h-4 text-red-600" />
                  <span>What We NEVER Store or Collect:</span>
                </div>
                <ul className="text-xs text-red-950 space-y-1">
                  <li>• Detailed medical histories or physician notes</li>
                  <li>• Specific clinical diagnoses or lab reports</li>
                  <li>• Prescription drug schedules</li>
                  <li>• Permanent biometric tracking cookies or third-party ads</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>What is Kept Locally (In Your Device):</span>
                </div>
                <ul className="text-xs text-teal-950 space-y-1">
                  <li>• First name (optional greeting)</li>
                  <li>• Age bracket (e.g. 18–40 or 60+)</li>
                  <li>• Outdoor activity level (Low/Moderate/High)</li>
                  <li>• Broad sensitivity flags (heat, cardiovascular, asthma)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Principle 2: Local & Edge-First Processing */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface">
                2. Local-First &amp; On-Device Processing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              In this Round 1 Web MVP, the risk engine (<code className="font-mono text-primary font-semibold">lib/riskEngine.ts</code>) runs directly inside your browser client. Your personal age and sensitivity flags are never transmitted to our servers or third parties. They are evaluated on the fly against public environmental telemetry.
            </p>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container text-xs font-mono text-on-surface leading-relaxed">
              Input: [User Device] Profile Parameters (local) + Open-Meteo Weather (public API) 
              <br />
              → Evaluation: In-Browser JavaScript Execution
              <br />
              → Output: Rendered Personal Risk Level (No cloud transmission)
            </div>
          </section>

          {/* Principle 3: Permission-Based Geolocation */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface">
                3. Permission-Based Hyper-Local Geolocation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Hyper-local weather accuracy requires latitude and longitude coordinates. We never track your movement in the background without consent. Coordinates are requested explicitly via the standard browser Geolocation prompt. A manual city search fallback is always available for users who prefer not to share GPS coordinates.
            </p>
          </section>

          {/* Principle 4: Future Mobile Edge Roadmap */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <Lock className="w-5 h-5 text-tertiary" />
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface">
                4. Future Hardware &amp; Mobile Wearable Roadmap
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              When SwasthyaSathi AI expands to native Android and BLE wearable integration (heart rate, pulse oximetry, skin temperature), raw biometric waveforms will remain strictly inside the device&rsquo;s encrypted local storage. Machine learning models will run on-device (via quantized edge inference), ensuring health monitoring continues safely even during total network blackouts.
            </p>
          </section>

        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 pt-6 border-t border-surface-container flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-outline hover:text-on-surface transition-colors"
          >
            ← Return to Landing Overview
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-container transition-all"
          >
            <span>Launch Live Companion</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
