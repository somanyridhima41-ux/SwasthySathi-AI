/**
 * Cooling Shelters & Respite Infrastructure Types (SIH26181)
 */

export type ShelterType = 'cooling_center' | 'night_shelter' | 'clinic' | 'phc';

export interface CoolingShelter {
  id: string;
  name: string;
  type: ShelterType;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number | null;
  phone_number: string | null;
  is_open_now: boolean;
  created_at?: string;
  distance_km?: number; // Calculated dynamically relative to user coordinates
}

export interface ShelterTypeMeta {
  label: string;
  shortLabel: string;
  description: string;
  pinColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const SHELTER_TYPE_CONFIG: Record<ShelterType, ShelterTypeMeta> = {
  cooling_center: {
    label: "Cooling Center",
    shortLabel: "Cooling",
    description: "Air-conditioned or misted public refuge with hydration stations",
    pinColor: "#0284c7", // Sky/Blue
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-200",
  },
  night_shelter: {
    label: "Night Shelter (Rain Basera)",
    shortLabel: "Night Shelter",
    description: "Overnight shelter equipped with beds, fans, and drinking water",
    pinColor: "#7c3aed", // Purple
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
  },
  clinic: {
    label: "Heat Stroke Clinic / Hospital",
    shortLabel: "Clinic",
    description: "Medical facility equipped for emergency heat illness rehydration",
    pinColor: "#059669", // Emerald / Green
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
  },
  phc: {
    label: "Primary Health Centre (PHC)",
    shortLabel: "PHC",
    description: "Community health post with ORS packets and first-response care",
    pinColor: "#d97706", // Amber
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
  },
};
