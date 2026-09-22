"use client";

import React from "react";
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Users, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Snowflake,
  Bed,
  Cross
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoolingShelter, SHELTER_TYPE_CONFIG, ShelterType } from "@/types/shelter";
import { formatDistance, getDirectionsUrl } from "@/lib/shelterUtils";

interface ShelterCardProps {
  shelter: CoolingShelter;
  isSelected?: boolean;
  onSelect?: (shelter: CoolingShelter) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

export const ShelterCard: React.FC<ShelterCardProps> = ({
  shelter,
  isSelected = false,
  onSelect,
  userCoords,
}) => {
  const typeConfig = SHELTER_TYPE_CONFIG[shelter.type];
  const directionsUrl = getDirectionsUrl(
    userCoords?.latitude,
    userCoords?.longitude,
    shelter.latitude,
    shelter.longitude
  );

  const getTypeIcon = (type: ShelterType) => {
    switch (type) {
      case "cooling_center":
        return <Snowflake className="w-3.5 h-3.5" />;
      case "night_shelter":
        return <Bed className="w-3.5 h-3.5" />;
      case "clinic":
        return <Cross className="w-3.5 h-3.5" />;
      case "phc":
        return <ShieldAlert className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      id={`shelter-card-${shelter.id}`}
      onClick={() => onSelect?.(shelter)}
      className={cn(
        "group relative p-5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer text-left shadow-sm",
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md -translate-y-0.5"
          : "border-surface-container hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* Top Row: Type Badge + Distance & Status */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
              typeConfig.badgeBg,
              typeConfig.badgeText,
              typeConfig.badgeBorder
            )}
          >
            {getTypeIcon(shelter.type)}
            <span>{typeConfig.shortLabel}</span>
          </span>

          {/* Open Status */}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
              shelter.is_open_now
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-stone-50 text-stone-600 border-stone-200"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                shelter.is_open_now ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
              )}
            />
            {shelter.is_open_now ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Distance Indicator */}
        {shelter.distance_km !== undefined && (
          <div className="flex items-center gap-1 text-xs font-mono font-semibold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-md shrink-0">
            <Navigation className="w-3 h-3 text-primary rotate-45" />
            <span>{formatDistance(shelter.distance_km)}</span>
          </div>
        )}
      </div>

      {/* Shelter Name */}
      <h3 className="text-base sm:text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
        {shelter.name}
      </h3>

      {/* Address */}
      <div className="flex items-start gap-2 text-xs sm:text-sm text-on-surface-variant mb-3">
        <MapPin className="w-4 h-4 text-outline shrink-0 mt-0.5" />
        <span className="line-clamp-2">{shelter.address}</span>
      </div>

      {/* Meta Specs: Capacity and Phone */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 border-t border-surface-container-low text-xs text-on-surface-variant">
        {shelter.capacity !== null && (
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Capacity: <strong className="text-on-surface font-semibold">{shelter.capacity}</strong></span>
          </div>
        )}

        {shelter.phone_number && (
          <a
            href={`tel:${shelter.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 font-medium text-primary hover:underline hover:text-primary-container"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>{shelter.phone_number}</span>
          </a>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-low">
        <span className="text-[11px] text-outline font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Tap to focus on map</span>
        </span>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container active:scale-95 transition-all shadow-sm"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
          <span>Directions</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>
    </div>
  );
};
