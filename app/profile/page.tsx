"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sliders, 
  ShieldCheck, 
  UserCheck, 
  MapPin, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Info,
  Lock,
  HeartPulse
} from "lucide-react";
import { 
  UserProfile, 
  DEFAULT_PROFILE, 
  getStoredProfile, 
  saveProfile, 
  resetProfile, 
  AgeGroup, 
  OutdoorActivityLevel, 
  SensitivityFlag 
} from "@/lib/profileStorage";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const handleSensitivityToggle = (flag: SensitivityFlag) => {
    if (flag === "none") {
      setProfile((prev) => ({ ...prev, sensitivities: ["none"] }));
      return;
    }

    setProfile((prev) => {
      const filtered = prev.sensitivities.filter((s) => s !== "none");
      if (filtered.includes(flag)) {
        const remaining = filtered.filter((s) => s !== flag);
        return { ...prev, sensitivities: remaining.length === 0 ? ["none"] : remaining };
      } else {
        return { ...prev, sensitivities: [...filtered, flag] };
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };

  const handleReset = () => {
    if (confirm("Reset profile settings to default demo values?")) {
      const defaults = resetProfile();
      setProfile(defaults);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2000);
    }
  };

  const handleGpsLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Browser Geolocation is not supported on this device.");
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setProfile((prev) => ({
          ...prev,
          location: `GPS Position (${lat.toFixed(3)}° N, ${lon.toFixed(3)}° E)`,
          latitude: lat,
          longitude: lon,
        }));
      },
      (err) => {
        setIsDetectingGps(false);
        alert(`Could not acquire GPS: ${err.message}. Please enter your city manually.`);
      },
      { timeout: 10000 }
    );
  };

  // Preset quick-loader for SIH demonstration
  const applyPreset = (type: "worker" | "senior" | "asthma" | "student") => {
    let preset: Partial<UserProfile> = {};
    if (type === "worker") {
      preset = {
        firstName: "Ramesh",
        ageGroup: "18-40",
        outdoorActivityLevel: "high",
        sensitivities: ["heat"],
        location: "New Delhi, Delhi NCR",
        emergencyContactName: "Anita Sharma",
        emergencyContactPhone: "+91 98111 22334",
      };
    } else if (type === "senior") {
      preset = {
        firstName: "Devendra",
        ageGroup: "60+",
        outdoorActivityLevel: "low",
        sensitivities: ["cardiovascular", "heat"],
        location: "Jaipur, Rajasthan",
        emergencyContactName: "Sanjay Verma",
        emergencyContactPhone: "+91 98222 33445",
      };
    } else if (type === "asthma") {
      preset = {
        firstName: "Pooja",
        ageGroup: "18-40",
        outdoorActivityLevel: "moderate",
        sensitivities: ["respiratory"],
        location: "Kolkata, West Bengal",
        emergencyContactName: "Meera Sen",
        emergencyContactPhone: "+91 98333 44556",
      };
    } else {
      preset = {
        firstName: "Kabir",
        ageGroup: "under18",
        outdoorActivityLevel: "moderate",
        sensitivities: ["none"],
        location: "Bengaluru, Karnataka",
        emergencyContactName: "Dr. Sunita Rao",
        emergencyContactPhone: "+91 98444 55667",
      };
    }

    const updated = { ...profile, ...preset };
    setProfile(updated);
    saveProfile(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-surface py-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-surface-container mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-mono text-primary font-semibold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalization Settings</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
              Health Risk Profile &amp; Sensitivities
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Configure parameters used by the deterministic risk engine to tailor environmental early warnings.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-sm self-start sm:self-auto"
          >
            <span>View Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Demo Preset Switcher for Hackathon Judges */}
        <div className="p-4 rounded-2xl bg-white border border-surface-container shadow-xs mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Quick-Test Demographic Presets (For SIH Demonstration):
            </span>
            <span className="text-[10px] font-mono text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
              1-Click Load
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyPreset("worker")}
              className="p-2.5 rounded-xl border border-surface-container hover:border-primary/40 bg-surface-container-low hover:bg-white text-left transition-all text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-on-surface">Outdoor Worker</span>
              <span className="text-[10px] text-outline mt-0.5">High sun • Heat sensitive</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset("senior")}
              className="p-2.5 rounded-xl border border-surface-container hover:border-primary/40 bg-surface-container-low hover:bg-white text-left transition-all text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-on-surface">Senior Citizen (60+)</span>
              <span className="text-[10px] text-outline mt-0.5">Cardiac • Indoors</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset("asthma")}
              className="p-2.5 rounded-xl border border-surface-container hover:border-primary/40 bg-surface-container-low hover:bg-white text-left transition-all text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-on-surface">Asthma Patient</span>
              <span className="text-[10px] text-outline mt-0.5">Respiratory sensitive</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset("student")}
              className="p-2.5 rounded-xl border border-surface-container hover:border-primary/40 bg-surface-container-low hover:bg-white text-left transition-all text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-on-surface">Young Adult</span>
              <span className="text-[10px] text-outline mt-0.5">No sensitivities</span>
            </button>
          </div>
        </div>

        {/* The Profile Configuration Form */}
        <form onSubmit={handleSave} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
          
          {/* Explicit Privacy Principle Notice */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface block mb-0.5">Privacy Principle &amp; Data Minimization:</strong>
              We only collect what is needed to personalize your environmental risk score. No medical history, hospital records, or diagnosis data is stored. All parameters are stored locally on your device in this MVP.
            </div>
          </div>

          {/* Section 1: Basic Identity & Age Group */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface pb-2 border-b border-surface-container">
              1. Basic Identity &amp; Age Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-[10px] text-outline mt-1 block">
                  Used only for personalization greetings.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Age Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.ageGroup}
                  onChange={(e) => setProfile({ ...profile, ageGroup: e.target.value as AgeGroup })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="under18">Under 18 (Developing Thermoregulation)</option>
                  <option value="18-40">18–40 (Adult Standard Baseline)</option>
                  <option value="41-60">41–60 (Early Cardiovascular Vulnerability)</option>
                  <option value="60+">60+ (Elevated Heat &amp; Dehydration Risk)</option>
                </select>
                <span className="text-[10px] text-outline mt-1 block">
                  Determines physiological dehydration &amp; cardiovascular thresholds.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Exposure Level */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface pb-2 border-b border-surface-container">
              2. Location &amp; Outdoor Activity Pattern
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Primary Location / City
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, Delhi NCR"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={handleGpsLocation}
                    disabled={isDetectingGps}
                    className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary transition-colors flex items-center justify-center"
                    title="Auto-detect via GPS"
                  >
                    <Compass className={cn("w-4 h-4", isDetectingGps && "animate-spin")} />
                  </button>
                </div>
                <span className="text-[10px] text-outline mt-1 block">
                  Click the compass to acquire live latitude/longitude from your browser.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Outdoor Exposure Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.outdoorActivityLevel}
                  onChange={(e) => setProfile({ ...profile, outdoorActivityLevel: e.target.value as OutdoorActivityLevel })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low (Mostly indoors / air-conditioned environment)</option>
                  <option value="moderate">Moderate (Commuter / occasional outdoor transit)</option>
                  <option value="high">High (Outdoor manual labor / direct sun &amp; traffic)</option>
                </select>
                <span className="text-[10px] text-outline mt-1 block">
                  Direct sunlight and exertion multiply dehydration and thermal stress.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Targeted Sensitivity Flags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline font-bold text-base text-on-surface">
                3. Physiological Sensitivity Flags
              </h3>
              <span className="text-[11px] font-mono text-outline">Multi-Select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Respiratory */}
              <label className={cn(
                "p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all",
                profile.sensitivities.includes("respiratory")
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-surface-container-low border-surface-container hover:bg-surface-container"
              )}>
                <input
                  type="checkbox"
                  checked={profile.sensitivities.includes("respiratory")}
                  onChange={() => handleSensitivityToggle("respiratory")}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    Respiratory Condition (e.g. Asthma, Chronic Bronchitis)
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">
                    Lowers PM2.5 tolerance thresholds; escalates poor AQI warnings earlier.
                  </span>
                </div>
              </label>

              {/* Cardiovascular */}
              <label className={cn(
                "p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all",
                profile.sensitivities.includes("cardiovascular")
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-surface-container-low border-surface-container hover:bg-surface-container"
              )}>
                <input
                  type="checkbox"
                  checked={profile.sensitivities.includes("cardiovascular")}
                  onChange={() => handleSensitivityToggle("cardiovascular")}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    Cardiovascular Condition (e.g. Hypertension)
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">
                    Escalates heat risk due to cardiac workload during thermal vasodilation.
                  </span>
                </div>
              </label>

              {/* Heat Sensitivity */}
              <label className={cn(
                "p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all",
                profile.sensitivities.includes("heat")
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-surface-container-low border-surface-container hover:bg-surface-container"
              )}>
                <input
                  type="checkbox"
                  checked={profile.sensitivities.includes("heat")}
                  onChange={() => handleSensitivityToggle("heat")}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    Heat Sensitivity / History of Heat Syncope
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">
                    Triggers hydration and shaded cooling alerts at lower ambient temperatures.
                  </span>
                </div>
              </label>

              {/* None */}
              <label className={cn(
                "p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all",
                profile.sensitivities.includes("none")
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-surface-container-low border-surface-container hover:bg-surface-container"
              )}>
                <input
                  type="checkbox"
                  checked={profile.sensitivities.includes("none")}
                  onChange={() => handleSensitivityToggle("none")}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-xs text-on-surface block">
                    None / Prefer Not to Say
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">
                    Evaluates risk strictly based on environmental metrics, age, and exposure.
                  </span>
                </div>
              </label>

            </div>
          </div>

          {/* Section 4: Emergency Contact Information (For SOS) */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface pb-2 border-b border-surface-container">
              4. Emergency Contact (For Distress SOS Broadcast)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Designated Emergency Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={profile.emergencyContactName}
                  onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Emergency Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={profile.emergencyContactPhone}
                  onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-outline hover:text-red-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-container transition-all active:scale-95"
              >
                Save Profile Parameters
              </button>
            </div>
          </div>

        </form>

        {/* Success Toast */}
        {isSavedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-5 h-5 text-primary-fixed" />
            <div className="text-xs">
              <span className="font-bold block">Profile Successfully Saved!</span>
              <span className="text-white/80">Dashboard risk engine updated instantly.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
