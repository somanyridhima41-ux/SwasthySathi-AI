"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Navigation, 
  Filter, 
  ShieldAlert, 
  AlertCircle,
  Map as MapIcon, 
  List, 
  RotateCcw,
  Sparkles,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoolingShelter, ShelterType, SHELTER_TYPE_CONFIG } from "@/types/shelter";
import { filterAndSortShelters } from "@/lib/shelterUtils";
import { ShelterCard } from "@/components/shelters/ShelterCard";
import { SheltersMap } from "@/components/shelters/SheltersMap";
import { ShelterSkeleton } from "@/components/shelters/ShelterSkeleton";
import { getStoredProfile } from "@/lib/profileStorage";

type MobileTab = "list" | "map";

export default function SheltersPage() {
  const [shelters, setShelters] = useState<CoolingShelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"supabase" | "fallback">("fallback");

  // Geolocation & User Coordinates
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [isLocating, setIsLocating] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ShelterType | "all">("all");
  const [selectedShelter, setSelectedShelter] = useState<CoolingShelter | null>(null);

  // Mobile View Toggle
  const [mobileTab, setMobileTab] = useState<MobileTab>("list");

  // Request browser geolocation
  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeoStatus("granted");
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation prompt was denied or timed out:", error.message);
        setGeoStatus("denied");
        setIsLocating(false);
        // Fall back to stored profile location if available
        const profile = getStoredProfile();
        if (profile.latitude && profile.longitude) {
          setUserCoords({
            latitude: profile.latitude,
            longitude: profile.longitude,
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Fetch Shelters from API or Fallback service on mount
  useEffect(() => {
    const fetchShelters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/shelters");
        if (res.ok) {
          const data = await res.json();
          if (data.shelters) {
            setShelters(data.shelters);
            setDataSource(data.source || "supabase");
          }
        }
      } catch (err) {
        console.warn("Could not fetch from /api/shelters, using local fallback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelters();
    requestLocation();
  }, [requestLocation]);

  // Filtered and sorted shelters list
  const filteredShelters = useMemo(() => {
    return filterAndSortShelters({
      shelters,
      searchQuery,
      selectedType,
      userCoords,
    });
  }, [shelters, searchQuery, selectedType, userCoords]);

  // Synchronized Selection Handler: scrolls card into view when clicked on map or card
  const handleSelectShelter = (shelter: CoolingShelter) => {
    setSelectedShelter(shelter);

    // Scroll card into view in list container
    setTimeout(() => {
      const cardElement = document.getElementById(`shelter-card-${shelter.id}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedShelter(null);
  };

  const filterTabs: { id: ShelterType | "all"; label: string; count?: number }[] = [
    { id: "all", label: "All Shelters" },
    { id: "cooling_center", label: "Cooling Centers" },
    { id: "night_shelter", label: "Night Shelters" },
    { id: "clinic", label: "Clinics" },
    { id: "phc", label: "PHCs" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Banner / Hero */}
      <section className="bg-white border-b border-surface-container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-outline" />
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-outline" />
            <span className="text-primary font-semibold">Cooling Shelters</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-primary-fixed text-primary">
                  <Compass className="w-5 h-5" />
                </span>
                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
                  Cooling Shelters & Heat Respite Locator
                </h1>
              </div>

              <p className="text-sm text-on-surface-variant max-w-2xl">
                Find verified public cooling refuges, air-conditioned respite points, DUSIB/BMC night shelters,
                and Primary Health Centres (PHCs) equipped with emergency hydration and heatstroke response units.
              </p>
            </div>

            {/* Geolocation Status Badge & GPS Re-trigger */}
            <div className="flex items-center gap-3">
              {geoStatus === "granted" && userCoords ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>GPS Active • Sorted by proximity</span>
                </div>
              ) : (
                <button
                  onClick={requestLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container border border-surface-container-high hover:border-primary/40 text-xs font-semibold text-primary transition-all active:scale-95 disabled:opacity-60"
                >
                  <Navigation className={cn("w-3.5 h-3.5 rotate-45", isLocating && "animate-spin")} />
                  <span>{isLocating ? "Acquiring GPS..." : "Enable Precise Geolocation"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Strip */}
          <div className="mt-6 space-y-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nearby shelters, PHCs, clinics, or areas (e.g. Connaught Place, Dadar)..."
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-surface-container rounded-xl text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-outline hover:text-on-surface px-2 py-1 rounded-md bg-white border border-surface-container shadow-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-on-surface-variant shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Filter:</span>
              </span>

              {filterTabs.map((tab) => {
                const isActive = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border",
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-on-surface-variant border-surface-container hover:bg-surface-container-low"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Mobile View Toggle Bar (Only visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-1 rounded-xl border border-surface-container shadow-xs">
          <button
            onClick={() => setMobileTab("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
              mobileTab === "list"
                ? "bg-primary text-white shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <List className="w-4 h-4" />
            <span>List View ({filteredShelters.length})</span>
          </button>

          <button
            onClick={() => setMobileTab("map")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all",
              mobileTab === "map"
                ? "bg-primary text-white shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <MapIcon className="w-4 h-4" />
            <span>Interactive Map</span>
          </button>
        </div>

        {/* Desktop Split Layout (Side-by-side) / Mobile Tab Switch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Shelter Cards List */}
          <div
            className={cn(
              "lg:col-span-6 xl:col-span-5 space-y-4",
              mobileTab === "map" ? "hidden lg:block" : "block"
            )}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between text-xs text-on-surface-variant px-1 font-medium">
              <span>
                Showing <strong className="text-on-surface font-semibold">{filteredShelters.length}</strong> verified locations
              </span>

              {selectedShelter && (
                <button
                  onClick={() => setSelectedShelter(null)}
                  className="text-primary hover:underline font-semibold"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <ShelterSkeleton />
            ) : filteredShelters.length > 0 ? (
              <div className="space-y-3.5 max-h-[calc(100vh-280px)] lg:overflow-y-auto pr-1">
                {filteredShelters.map((shelter) => (
                  <ShelterCard
                    key={shelter.id}
                    shelter={shelter}
                    isSelected={selectedShelter?.id === shelter.id}
                    onSelect={handleSelectShelter}
                    userCoords={userCoords}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-8 text-center bg-white rounded-2xl border border-surface-container shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                  <ShieldAlert className="w-6 h-6 text-outline" />
                </div>

                <h3 className="font-headline font-bold text-base text-on-surface">
                  No Cooling Shelters Found
                </h3>

                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  No shelters match your current search query or category filter. Try clearing your filters or searching another area.
                </p>

                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}

            {/* Public Health Advisory Note */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-on-surface-variant space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Info className="w-4 h-4 shrink-0" />
                <span>Extreme Heat Guidance (NDMA & IMD)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                If someone shows signs of heat exhaustion (dizziness, nausea, profuse sweating) or heat stroke (dry hot skin, confusion), move them immediately to a shaded cooling refuge or emergency PHC and hydrate with cold water and ORS.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div
            className={cn(
              "lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 h-[550px] lg:h-[calc(100vh-160px)] min-h-[400px]",
              mobileTab === "list" ? "hidden lg:block" : "block"
            )}
          >
            <SheltersMap
              shelters={filteredShelters}
              selectedShelter={selectedShelter}
              onSelectShelter={handleSelectShelter}
              userCoords={userCoords}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
