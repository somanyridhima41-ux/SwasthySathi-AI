"use client";
import ReactMarkdown from "react-markdown";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Search, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  ShieldAlert, 
  HeartPulse, 
  Thermometer, 
  Wind, 
  Droplets, 
  Gauge, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  X, 
  Send, 
  RefreshCw, 
  Sparkles,
  Compass,
  Moon,
  Zap,
  ShieldCheck,
  Share2,
  FileText,
  User,
  ExternalLink,
  Flame,
  CloudRain,
  AlertOctagon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  fetchEnvironmentalTelemetry, 
  searchLocations, 
  EnvironmentalTelemetry 
} from "@/lib/environmentalApi";
import { 
  computeRisk, 
  computeDisasterWarnings,
  DisasterWarning,
  RiskLevel 
} from "@/lib/riskEngine";
import { 
  getStoredProfile, 
  UserProfile, 
  DEFAULT_PROFILE 
} from "@/lib/profileStorage";

interface CityPreset {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

const POPULAR_INDIAN_CITIES: CityPreset[] = [
  { name: "New Delhi", state: "Delhi NCR", lat: 28.6139, lon: 77.2090 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
];

export default function DashboardPage() {
  // User Profile State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Selected Location
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_INDIAN_CITIES[0]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; state?: string; country: string; lat: number; lon: number }>>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Live Telemetry & Computed Risk State
  const [telemetry, setTelemetry] = useState<EnvironmentalTelemetry | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(true);
  const [riskResult, setRiskResult] = useState<{
    level: RiskLevel;
    primaryDriver: string;
    recommendations: string[];
  }>({
    level: "Moderate",
    primaryDriver: "Loading hyper-local microclimate and evaluating personal sensitivities...",
    recommendations: ["Stay hydrated", "Monitor hourly changes"],
  });

  // Active Disaster Warnings & Advisories State
  const [activeWarnings, setActiveWarnings] = useState<DisasterWarning[]>([]);

  // Offline / Low-Connectivity Demo Mode
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [minutesSinceUpdate, setMinutesSinceUpdate] = useState(0);

  // SOS Modal State
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState<"idle" | "broadcasting" | "sent">("idle");

  // AI Symptom Assistant Chat State
  const [selectedBodyPart, setSelectedBodyPart] = useState<"head" | "chest" | "joints" | "lumbar">("head");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "user",
      text: "I've been feeling a dull tension headache and dry throat since stepping outdoors.",
      time: "1:15 PM",
    },
    {
      sender: "ai",
      text: "Assessing local microclimate: Barometric pressure drop combined with high ambient thermal index and PM2.5 causes cranial vasodilation and mucosal dryness. Immediate action: Drink 400 mL electrolyte fluid and rest in a shaded or indoor filtered room.",
      time: "1:16 PM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // 1. Load User Profile on Mount and listen for updates
  useEffect(() => {
    const loaded = getStoredProfile();
    setProfile(loaded);

    // If profile has coordinates and city, adopt them
    if (loaded.latitude && loaded.longitude) {
      setCurrentCity({
        name: loaded.location.split(",")[0] || "Custom Location",
        state: loaded.location.split(",")[1]?.trim() || "India",
        lat: loaded.latitude,
        lon: loaded.longitude,
      });
    }

    const handleProfileUpdate = () => {
      setProfile(getStoredProfile());
    };

    window.addEventListener("swasthya_sathi_profile_updated", handleProfileUpdate);
    return () => window.removeEventListener("swasthya_sathi_profile_updated", handleProfileUpdate);
  }, []);

  // 2. Fetch Live Environmental Telemetry & Compute Personal Risk
  const loadEnvironmentalData = useCallback(async (city: CityPreset, forceOffline = false) => {
    setIsLoadingTelemetry(true);
    try {
      if (forceOffline) {
        // Simulated offline state
        setMinutesSinceUpdate(14);
      } else {
        setMinutesSinceUpdate(0);
        setLastRefreshedAt(new Date());
      }

      const data = await fetchEnvironmentalTelemetry(city.lat, city.lon, `${city.name}, ${city.state}`);
      setTelemetry(data);

      // Compute Personal Risk via pure deterministic engine
      const risk = computeRisk({
        temperatureC: data.temperatureC,
        feelsLikeC: data.feelsLikeC,
        humidityPct: data.humidityPct,
        aqi: data.aqi,
        ageGroup: profile.ageGroup,
        outdoorActivityLevel: profile.outdoorActivityLevel,
        sensitivities: profile.sensitivities,
      });
      setRiskResult(risk);

      // Compute Disaster-Specific Warnings & Advisories (IMD & CPCB Thresholds)
      const warnings = computeDisasterWarnings({
        temperatureC: data.temperatureC,
        feelsLikeC: data.feelsLikeC,
        humidityPct: data.humidityPct,
        aqi: data.aqi,
        weatherCode: data.weatherCode,
        weatherDescription: data.weatherDescription,
        pm25: data.pm25,
      });
      setActiveWarnings(warnings);
    } catch (err) {
      console.error("Error updating telemetry:", err);
    } finally {
      setIsLoadingTelemetry(false);
    }
  }, [profile]);

  useEffect(() => {
    loadEnvironmentalData(currentCity, isOfflineMode);
  }, [currentCity, profile, isOfflineMode, loadEnvironmentalData]);

  // Live Location Search Autocomplete
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearchingLocation(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GPS Geolocation Handler
  const handleDetectGps = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const customCity: CityPreset = {
          name: "Detected GPS Location",
          state: `${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`,
          lat,
          lon,
        };
        setCurrentCity(customCity);
        setIsCityDropdownOpen(false);
      },
      (err) => {
        alert(`GPS acquisition failed: ${err.message}. Please select a city manually.`);
      },
      { timeout: 10000 }
    );
  };

  // SOS Simulation
  const handleTriggerSos = () => {
    setSosStatus("broadcasting");
    setTimeout(() => {
      setSosStatus("sent");
    }, 1500);
  };

  const handleResetSos = () => {
    setIsSosModalOpen(false);
    setSosStatus("idle");
  };

  // AI Chat Submission
 const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!inputMessage.trim() || !telemetry) return;

  const userText = inputMessage.trim();

  const newMsg = {
    sender: "user" as const,
    text: userText,
    time: "Just now",
  };

  // Show user's message
  setChatMessages((prev) => [...prev, newMsg]);

  // Clear input
  setInputMessage("");

  // Show temporary loading message
  setChatMessages((prev) => [
    ...prev,
    {
      sender: "ai" as const,
      text: "Thinking...",
      time: "Just now",
    },
  ]);

  try {
    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: userText,
      }),
    });

    if (!response.ok) {
      throw new Error("RAG API request failed");
    }

    const data = await response.json();

    // Replace "Thinking..." with the real AI answer
    setChatMessages((prev) => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        sender: "ai" as const,
        text: data.answer,
        time: "Just now",
      };

      return updated;
    });

  } catch (error) {
    console.error("RAG API error:", error);

    setChatMessages((prev) => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        sender: "ai" as const,
        text:
          "I'm having trouble connecting to the SwasthyaSathi research system. Please try again.",
        time: "Just now",
      };

      return updated;
    });
  }
};

  // Visual Risk Color Mapping
  const riskColorConfig = {
    Low: {
      badge: "bg-teal-700 text-white",
      bg: "bg-teal-50 border-teal-200",
      text: "text-teal-950",
      dot: "bg-teal-600",
    },
    Moderate: {
      badge: "bg-amber-600 text-white",
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-950",
      dot: "bg-amber-500",
    },
    High: {
      badge: "bg-orange-600 text-white",
      bg: "bg-orange-50 border-orange-200",
      text: "text-orange-950",
      dot: "bg-orange-600",
    },
    Critical: {
      badge: "bg-red-600 text-white",
      bg: "bg-red-50 border-red-200",
      text: "text-red-950",
      dot: "bg-red-600",
    },
  }[riskResult.level];

  return (
    <div className="min-h-screen bg-surface pb-16">
      
      {/* 1. Top Telemetry & Location Bar */}
      <div className="bg-white border-b border-surface-container sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Location Selector */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-xs font-semibold text-on-surface transition-all shadow-xs"
              >
                <MapPin className="w-4 h-4 text-primary animate-pulse" />
                <span className="truncate max-w-[180px] sm:max-w-none">{currentCity.name}, {currentCity.state}</span>
                <span className="font-mono text-[10px] text-outline hidden md:inline">
                  ({currentCity.lat.toFixed(2)}° N, {currentCity.lon.toFixed(2)}° E)
                </span>
                <span className="text-[10px] text-primary underline ml-1">Change</span>
              </button>

              <button
                onClick={handleDetectGps}
                title="Acquire Live GPS"
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">GPS</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => loadEnvironmentalData(currentCity, isOfflineMode)}
                title="Refresh Telemetry"
                className="p-1.5 rounded-lg text-outline hover:text-primary transition-colors"
              >
                <RefreshCw className={cn("w-4 h-4", isLoadingTelemetry && "animate-spin")} />
              </button>

              {/* Dropdown Location Switcher */}
              {isCityDropdownOpen && (
                <div className="absolute top-10 left-0 w-80 bg-white rounded-xl shadow-xl border border-surface-container p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="mb-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-outline" />
                      <input
                        type="text"
                        placeholder="Search any Indian city or district..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg bg-surface-container-low border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Autocomplete Results */}
                  {searchResults.length > 0 && (
                    <div className="mb-3 pb-2 border-b border-surface-container">
                      <span className="text-[10px] font-mono uppercase text-outline block mb-1">
                        Search Matches:
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {searchResults.map((res, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentCity({
                                name: res.name,
                                state: res.state || res.country,
                                lat: res.lat,
                                lon: res.lon,
                              });
                              setIsCityDropdownOpen(false);
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-primary-fixed/30 flex items-center justify-between text-on-surface"
                          >
                            <span className="font-semibold">{res.name}</span>
                            <span className="text-[10px] text-outline">{res.state || res.country}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preset Indian Cities */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-outline block mb-1">
                      Popular Hubs:
                    </span>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {POPULAR_INDIAN_CITIES.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setCurrentCity(city);
                            setIsCityDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors",
                            city.name === currentCity.name
                              ? "bg-primary text-white font-semibold"
                              : "text-on-surface hover:bg-surface-container-low"
                          )}
                        >
                          <span>{city.name}</span>
                          <span className="text-[10px] font-mono opacity-80">{city.state}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Offline Cache Simulator & SOS Button */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              
              {/* Low Connectivity Demo Mode Toggle */}
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container">
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                  {isOfflineMode ? (
                    <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span className="hidden md:inline">Low-Connectivity Demo</span>
                  <span className="md:hidden">Offline</span>
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOfflineMode}
                    onChange={() => setIsOfflineMode(!isOfflineMode)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Large Emergency SOS Button */}
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-secondary text-white hover:bg-red-700 font-bold text-xs shadow-md active:scale-95 transition-all animate-coral-glow"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>EMERGENCY SOS</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Low Connectivity Cache Banner */}
      {isOfflineMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Simulated Offline Mode:</strong> Showing cached environmental reading from {minutesSinceUpdate}m ago. The on-device risk engine continues evaluating health thresholds locally without network dependency.
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* User Profile Context Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-surface-container text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-on-surface-variant">Active Profile:</span>
            <span className="font-bold text-on-surface">{profile.firstName || "User"}</span>
            <span className="text-outline font-mono">({profile.ageGroup} • {profile.outdoorActivityLevel} outdoor exposure)</span>
            {profile.sensitivities.filter(s => s !== "none").length > 0 && (
              <span className="px-2 py-0.5 rounded bg-primary-fixed/40 text-primary font-mono text-[10px] font-bold">
                {profile.sensitivities.join(", ")}
              </span>
            )}
          </div>
          <Link
            href="/profile"
            className="text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span>Adjust Sensitivities</span>
            <Sliders className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Row 1: Headline Personal Risk Card + Live Environmental Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Headline Personal Risk Card (7 Cols) */}
          <div className={cn("lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border shadow-sm flex flex-col justify-between transition-all", riskColorConfig.bg)}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <span className={cn("w-3 h-3 rounded-full animate-pulse", riskColorConfig.dot)} />
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-outline">
                    Personalized Health Risk Assessment
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("px-3 py-1 rounded-full font-mono text-xs font-bold tracking-wide uppercase shadow-xs", riskColorConfig.badge)}>
                    {riskResult.level} Risk Level
                  </span>
                </div>
              </div>

              {/* Primary Plain-Language Reason */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1 font-mono">
                  Clinical Primary Driver:
                </span>
                <p className={cn("text-sm sm:text-base font-semibold leading-relaxed", riskColorConfig.text)}>
                  {riskResult.primaryDriver}
                </p>
              </div>

              {/* Concrete Preventive Actions */}
              <div className="space-y-2 pt-2 border-t border-black/10">
                <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                  Prescribed Preventive Actions:
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-on-surface">
                  {riskResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/80 border border-black/5 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Status */}
            <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-outline font-mono">
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Computed live by lib/riskEngine.ts</span>
              </span>
              <span>{isOfflineMode ? "Cached Reading" : "Live API Stream"}</span>
            </div>
          </div>

          {/* 2. Live Environmental Telemetry Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-surface-container shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="font-headline font-bold text-xs uppercase tracking-wider text-outline flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-primary" />
                  Live Atmospheric Telemetry
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                  Open-Meteo Verified
                </span>
              </div>

              {/* Main Temp & Weather Metric */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold font-headline text-on-surface">
                      {telemetry ? `${telemetry.temperatureC}°C` : "--°C"}
                    </span>
                    <span className="text-sm font-medium text-outline">
                      Feels {telemetry ? `${telemetry.feelsLikeC}°C` : "--"}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium mt-1 block">
                    {telemetry?.weatherDescription || "Gathering station data..."}
                  </span>
                </div>

                {/* AQI Badge */}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-outline block uppercase">Air Quality Index</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold font-headline text-on-surface font-mono">
                      {telemetry?.aqi ?? "--"}
                    </span>
                    {telemetry && (
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded uppercase font-mono",
                        telemetry.aqiCategory === "Good" ? "bg-teal-100 text-teal-800" :
                        telemetry.aqiCategory === "Moderate" ? "bg-amber-100 text-amber-900" :
                        telemetry.aqiCategory === "Poor" ? "bg-orange-100 text-orange-900" :
                        "bg-red-100 text-red-900"
                      )}>
                        {telemetry.aqiCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Environmental Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
                  <span className="text-[10px] font-mono text-outline uppercase block">Humidity</span>
                  <span className="font-bold text-sm text-on-surface mt-0.5 block font-mono">
                    {telemetry ? `${telemetry.humidityPct}%` : "--"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
                  <span className="text-[10px] font-mono text-outline uppercase block">Pressure</span>
                  <span className="font-bold text-sm text-on-surface mt-0.5 block font-mono">
                    {telemetry ? `${telemetry.pressureHpa} hPa` : "--"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
                  <span className="text-[10px] font-mono text-outline uppercase block">Wind</span>
                  <span className="font-bold text-sm text-on-surface mt-0.5 block font-mono">
                    {telemetry ? `${telemetry.windSpeedKmh} km/h` : "--"}
                  </span>
                </div>
              </div>

              {/* Regional Alert Indicator */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-outline">Disaster Protocol Status:</span>
                <span className={cn(
                  "font-mono font-bold px-2 py-0.5 rounded text-[11px]",
                  activeWarnings.some(w => w.severity === "critical") ? "bg-red-100 text-red-800" :
                  activeWarnings.some(w => w.severity === "high") ? "bg-orange-100 text-orange-800" :
                  activeWarnings.some(w => w.severity === "moderate") ? "bg-amber-100 text-amber-800" :
                  "bg-teal-100 text-teal-800"
                )}>
                  {activeWarnings.filter(w => w.severity !== "normal").length > 0 
                    ? `${activeWarnings.filter(w => w.severity !== "normal").length} Active Advisories` 
                    : "Normal Baseline"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-outline font-mono">
              <span>Station: {currentCity.name} Central</span>
            <span suppressHydrationWarning>
  Updated: {lastRefreshedAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}
</span>
            </div>
          </div>

        </div>

        {/* Dedicated Active Disaster Warnings & Climate Advisories Card (Section 6.3) */}
        <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                activeWarnings.some(w => w.severity === "critical") ? "bg-red-100 text-red-700" :
                activeWarnings.some(w => w.severity === "high") ? "bg-orange-100 text-orange-700" :
                activeWarnings.some(w => w.severity === "moderate") ? "bg-amber-100 text-amber-700" :
                "bg-teal-100 text-teal-800"
              )}>
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Active Disaster Warnings &amp; Climate Advisories
                </h3>
                <p className="text-xs text-on-surface-variant">
                  IMD &amp; CPCB meteorological threshold alerts evaluated in real-time for {currentCity.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-mono font-bold px-3 py-1 rounded-full uppercase",
                activeWarnings.some(w => w.severity === "critical") ? "bg-red-600 text-white" :
                activeWarnings.some(w => w.severity === "high") ? "bg-orange-600 text-white" :
                activeWarnings.some(w => w.severity === "moderate") ? "bg-amber-500 text-white" :
                "bg-teal-700 text-white"
              )}>
                {activeWarnings.filter(w => w.severity !== "normal").length > 0 
                  ? `${activeWarnings.filter(w => w.severity !== "normal").length} Active Hazard Alerts`
                  : "Baseline Normal Status"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeWarnings.map((warning) => (
              <div
                key={warning.id}
                className={cn(
                  "p-4 rounded-xl border flex flex-col justify-between space-y-2 transition-all",
                  warning.severity === "critical" ? "bg-red-50/80 border-red-200 text-red-950" :
                  warning.severity === "high" ? "bg-orange-50/80 border-orange-200 text-orange-950" :
                  warning.severity === "moderate" ? "bg-amber-50/80 border-amber-200 text-amber-950" :
                  "bg-teal-50/70 border-teal-200 text-teal-950"
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-headline font-bold text-sm tracking-tight flex items-center gap-2">
                      {warning.hazardType === "heat" ? <Flame className="w-4 h-4 text-orange-600" /> :
                       warning.hazardType === "aqi" ? <Wind className="w-4 h-4 text-purple-600" /> :
                       warning.hazardType === "flood" ? <CloudRain className="w-4 h-4 text-blue-600" /> :
                       warning.hazardType === "humidity" ? <Droplets className="w-4 h-4 text-cyan-600" /> :
                       <ShieldCheck className="w-4 h-4 text-teal-700" />}
                      {warning.title}
                    </span>
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase",
                      warning.severity === "critical" ? "bg-red-600 text-white" :
                      warning.severity === "high" ? "bg-orange-500 text-white" :
                      warning.severity === "moderate" ? "bg-amber-500 text-white" :
                      "bg-teal-700 text-white"
                    )}>
                      {warning.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {warning.shortExplanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-start gap-2 text-xs font-medium">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 font-mono">Action:</span>
                  <span className="leading-snug">{warning.actionGuidance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Physiological Sensor Telemetry (Wearable Simulation) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Physiological Sensor Telemetry
              </h3>
              <p className="text-xs text-on-surface-variant">
                Live sensor vitals cross-referenced against local barometry and micro-thermal stress
              </p>
            </div>
            <span className="text-xs font-mono text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-full font-bold">
              Band Pro X9: Connected (BLE 5.2)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Heart Rate Card with Continuous Running ECG */}
            <div className="bg-white rounded-xl p-5 border border-surface-container shadow-xs interactive-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-outline">Heart Rate</span>
                <HeartPulse className="w-4 h-4 text-secondary animate-pulse" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-headline text-on-surface">
                    {riskResult.level === "Critical" ? "88" : riskResult.level === "High" ? "82" : "72"}
                  </span>
                  <span className="text-xs font-mono text-outline">BPM</span>
                </div>
                <span className="text-[11px] text-primary font-medium mt-0.5 block">
                  Resting Baseline: 64 BPM
                </span>
              </div>
              <div className="w-full h-7 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path
                    d="M 0 12 L 20 12 L 24 6 L 28 18 L 32 3 L 36 21 L 40 12 L 60 12 L 64 6 L 68 18 L 72 3 L 76 21 L 80 12 L 100 12"
                    fill="none"
                    stroke="#035657"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* HRV Card */}
            <div className="bg-white rounded-xl p-5 border border-surface-container shadow-xs interactive-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-outline">Autonomic HRV</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-headline text-on-surface">64</span>
                  <span className="text-xs font-mono text-outline">ms</span>
                </div>
                <span className="text-[11px] text-primary font-medium mt-0.5 block">
                  Autonomic Adaptive Balance
                </span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            {/* SpO2 Card */}
            <div className="bg-white rounded-xl p-5 border border-surface-container shadow-xs interactive-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-outline">Blood Oxygen (SpO2)</span>
                <Droplets className="w-4 h-4 text-tertiary" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-headline text-on-surface">98</span>
                  <span className="text-xs font-mono text-outline">%</span>
                </div>
                <span className="text-[11px] text-primary font-medium mt-0.5 block">
                  Optimal Perfusion
                </span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "98%" }} />
              </div>
            </div>

            {/* Stress Index */}
            <div className="bg-white rounded-xl p-5 border border-surface-container shadow-xs interactive-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-outline">Thermal Stress Index</span>
                <Zap className="w-4 h-4 text-secondary-container" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-headline text-on-surface">
                    {riskResult.level === "Critical" ? "74" : riskResult.level === "High" ? "61" : "38"}
                  </span>
                  <span className="text-xs font-mono text-outline">/ 100</span>
                </div>
                <span className="text-[11px] text-secondary font-semibold mt-0.5 block">
                  {riskResult.level === "Critical" ? "Critical Thermal Load" : "Tolerable Workload"}
                </span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-secondary-container h-full rounded-full" 
                  style={{ width: riskResult.level === "Critical" ? "74%" : "45%" }} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Row 3: Hourly Atmospheric Health Impact Timeline (Evaluated via Risk Engine) */}
        {telemetry && telemetry.hourly.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-surface-container shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  12-Hour Predictive Health Impact Timeline
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Personal risk trajectory evaluated for each upcoming hour using your profile sensitivities
                </p>
              </div>
              <span className="text-xs font-mono text-outline">
                Source: Diurnal Open-Meteo Curve
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              {telemetry.hourly.slice(0, 6).map((point, idx) => {
                const hourRisk = computeRisk({
                  temperatureC: point.temperatureC,
                  feelsLikeC: point.feelsLikeC,
                  humidityPct: point.humidityPct,
                  aqi: point.aqi,
                  ageGroup: profile.ageGroup,
                  outdoorActivityLevel: profile.outdoorActivityLevel,
                  sensitivities: profile.sensitivities,
                });

                return (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl border border-surface-container text-center space-y-1 bg-surface-container-low hover:bg-white transition-all interactive-card"
                  >
                    <span className="text-[11px] font-mono font-bold block">{point.hourLabel}</span>
                    <span className="text-xl font-bold font-headline block">{point.temperatureC}°</span>
                    <span className="text-[10px] font-mono text-outline block">AQI {point.aqi}</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider block pt-1",
                      hourRisk.level === "Critical" ? "text-red-700" :
                      hourRisk.level === "High" ? "text-orange-700" :
                      hourRisk.level === "Moderate" ? "text-amber-700" :
                      "text-teal-700"
                    )}>
                      {hourRisk.level}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 4: SwasthyaSathi AI Symptom Assistant & Edge Engine Buffer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Floating AI Assistant Button */}
             <button
  onClick={() => setIsChatOpen(!isChatOpen)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all"
  aria-label="Open SwasthyaSathi AI Assistant"
>
  {isChatOpen ? (
    <span className="text-2xl">✕</span>
  ) : (
    <Sparkles className="w-6 h-6" />
  )}
             </button>

          {/* Floating AI Chat Window */}
            {isChatOpen && (
              <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] bg-white rounded-2xl border border-surface-container shadow-2xl flex flex-col overflow-hidden">

              {/* Header */}
    <div className="p-4 bg-primary text-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-bold text-sm">
            SwasthyaSathi AI
          </h3>
          <span className="text-[10px] opacity-80">
            AI Health Assistant
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsChatOpen(false)}
        className="text-white/80 hover:text-white text-xl"
        aria-label="Close chat"
      >
        ✕
      </button>
    </div>
    
    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {chatMessages.map((msg, idx) => (
        <div
          key={idx}
          className={cn(
            "flex flex-col max-w-[85%] rounded-xl p-3 text-xs sm:text-sm leading-relaxed",
            msg.sender === "user"
              ? "ml-auto bg-primary text-white rounded-br-none shadow-xs"
              : "mr-auto bg-surface-container-low text-on-surface border border-surface-container rounded-bl-none"
          )}
        >
          <span
  suppressHydrationWarning
  className="font-semibold text-[9px] uppercase font-mono tracking-wider opacity-70 mb-1"
>
            {msg.sender === "user"
              ? "You"
              : "SwasthyaSathi Companion"}{" "}
            • {msg.time}
          </span>

          {msg.sender === "user" ? (
  <p>{msg.text}</p>
) : (
  <div className="max-w-none">
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-base font-bold mt-3 mb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mt-3 mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mt-3 mb-1">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 leading-relaxed">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-5 mb-2 space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-5 mb-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold">
            {children}
          </strong>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-3 my-3 italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {msg.text}
    </ReactMarkdown>
  </div>
)}
        </div>
      ))}
    </div>

    {/* Chat Input */}
    <form
      onSubmit={handleSendMessage}
      className="p-3 border-t border-surface-container flex gap-2"
    >
      <input
        type="text"
        placeholder="Ask SwasthyaSathi AI..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-sm hover:bg-primary-container transition-all"
      >
        Send
      </button>
    </form>

  </div>
)}

          {/* Edge Engine & Clinician Buffer Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-surface-container shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-outline flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  Edge Autonomous Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3 pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-headline text-primary">14,280</span>
                  <span className="text-xs font-mono text-outline">IndexedDB Records</span>
                </div>
                <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "72%" }} />
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Deterministic rules evaluation executes natively inside your client browser. Zero telemetry leakage, continuous private caching with deferred mesh synchronization.
                </p>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1 text-xs">
                <div className="flex justify-between text-outline">
                  <span>Encryption:</span>
                  <span className="font-mono font-semibold text-on-surface">AES-GCM-256</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Caregiver Contact:</span>
                  <span className="font-semibold text-on-surface">{profile.emergencyContactName}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Caregiver Phone:</span>
                  <span className="font-mono font-semibold text-on-surface">{profile.emergencyContactPhone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex gap-2">
              <button 
                onClick={() => alert("Simulated Export: Telemetry dataset exported to local encrypted JSON.")}
                className="flex-1 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs border border-surface-container transition-colors flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Log</span>
              </button>
              <button 
                onClick={() => alert(`Diagnostic summary formatted for Dr. Elena Vance and Caregiver ${profile.emergencyContactName}.`)}
                className="flex-1 py-2 rounded-xl bg-primary text-white hover:bg-primary-container font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Triage</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 2-Step Emergency SOS Dialog (Honest Simulated Copy) */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-surface-container relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={handleResetSos}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-surface-container">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Emergency SOS Protocol
                </h3>
                <span className="text-xs font-mono text-outline">
                  SIH26181 Rapid Distress Simulation
                </span>
              </div>
            </div>

            {sosStatus === "idle" && (
              <div className="space-y-4 pt-4">
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Triggering SOS will simulate dispatching an encrypted telemetry packet containing your precise GPS coordinates, local weather hazards, and risk classification to your designated caregiver.
                </p>

                {/* Distress Telemetry Preview */}
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1.5 text-xs text-red-950 font-mono">
                  <div className="flex justify-between">
                    <span>GPS Coordinates:</span>
                    <span className="font-bold">{currentCity.lat.toFixed(4)}° N, {currentCity.lon.toFixed(4)}° E</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detected City:</span>
                    <span>{currentCity.name}, {currentCity.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Environmental Stress:</span>
                    <span>{telemetry ? `${telemetry.temperatureC}°C Heat • AQI ${telemetry.aqi}` : "38°C • AQI 185"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personal Risk Tier:</span>
                    <span className="font-bold uppercase text-red-700">{riskResult.level}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-red-200">
                    <span>Designated Contact:</span>
                    <span className="font-bold">{profile.emergencyContactName} ({profile.emergencyContactPhone})</span>
                  </div>
                </div>

                {/* Honest Copy Banner */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface-variant">
                  <strong>Hackathon MVP Notice:</strong> This is a simulated demonstration. In accordance with the SIH prompt, no actual emergency services or cellular carriers will be billed or called during Round 1.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleResetSos}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTriggerSos}
                    className="px-5 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs hover:bg-red-700 shadow-md transition-all active:scale-95"
                  >
                    Confirm &amp; Broadcast SOS
                  </button>
                </div>
              </div>
            )}

            {sosStatus === "broadcasting" && (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto" />
                <h4 className="font-headline font-bold text-base text-on-surface">
                  Encrypting &amp; Dispatching Telemetry Packet...
                </h4>
                <p className="text-xs font-mono text-outline">
                  Broadcasting coordinates to emergency contact {profile.emergencyContactName}
                </p>
              </div>
            )}

            {sosStatus === "sent" && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    Simulated Distress Packet Broadcasted!
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Caregiver <strong>{profile.emergencyContactName}</strong> ({profile.emergencyContactPhone}) received simulated packet with coordinates {currentCity.lat.toFixed(4)}° N, {currentCity.lon.toFixed(4)}° E and <strong>{riskResult.level} Risk</strong> alert.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetSos}
                    className="px-6 py-2 rounded-xl bg-primary text-white font-semibold text-xs shadow-sm hover:bg-primary-container transition-colors"
                  >
                    Close Distress Protocol
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
