"use client";

import React from "react";
import dynamic from "next/dynamic";
import { CoolingShelter } from "@/types/shelter";
import { MapPin } from "lucide-react";

interface SheltersMapProps {
  shelters: CoolingShelter[];
  selectedShelter: CoolingShelter | null;
  onSelectShelter: (shelter: CoolingShelter) => void;
  userCoords: { latitude: number; longitude: number } | null;
}

const DynamicLeafletMap = dynamic(
  () => import("./SheltersMapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] lg:min-h-full rounded-2xl bg-surface-container-low border border-surface-container flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-primary animate-bounce" />
        </div>
        <p className="text-sm font-semibold text-on-surface">Loading Interactive Shelters Map...</p>
        <p className="text-xs text-on-surface-variant mt-1">Rendering OpenStreetMap tiles & verified respite pins</p>
      </div>
    ),
  }
);

export const SheltersMap: React.FC<SheltersMapProps> = (props) => {
  return <DynamicLeafletMap {...props} />;
};

export default SheltersMap;
