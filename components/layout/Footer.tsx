import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartPulse, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-surface-container bg-white text-on-surface-variant text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-surface-container">
          
          {/* Col 1: Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Activity className="w-4 h-4 text-primary-fixed" />
              </div>
              <span className="font-headline font-bold text-base text-primary">SwasthyaSathi AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container font-semibold text-outline">
                SIH26181
              </span>
            </div>
            <p className="max-w-md text-on-surface-variant leading-relaxed">
              Personalized, privacy-preserving environmental health early warning system built for Smart India Hackathon 2026 (Problem Statement 26181). Helping citizens preempt heat exhaustion, respiratory distress, and climate-induced emergencies.
            </p>
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero medical records stored • 100% on-device edge roadmap</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px] block">
              Application
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Overview & Architecture
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Live Companion Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  Personal Risk Profile
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hackathon Metadata */}
          <div className="space-y-2">
            <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px] block">
              SIH 2026 Track
            </span>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>Problem ID: 26181</li>
              <li>Category: MedTech / HealthTech</li>
              <li>Track: Hardware / Future Wearable</li>
              <li>Round: 1 MVP Deliverable</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-outline">
          <p>© 2026 SwasthyaSathi AI. Built for Smart India Hackathon 2026. Round 1 Demonstration Build.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Data Minimization
            </Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Interactive Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

