/**
 * Cooling Shelters Utilities (SIH26181)
 * 
 * Haversine distance computation, Google Maps directions deep-linking,
 * and client-side filtering/sorting logic.
 */

import { CoolingShelter, ShelterType } from "@/types/shelter";

/**
 * Computes great-circle distance between two GPS coordinates in kilometers.
 * Uses the Haversine formula (Earth radius R = 6371 km).
 */
export function computeHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 1 decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Formats distance cleanly for display:
 * e.g. "450 m" for < 1 km, "2.4 km" for >= 1 km.
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined || isNaN(distanceKm)) {
    return "Distance unknown";
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Constructs Google Maps directions URL.
 * Specification: https://www.google.com/maps/dir/?api=1&origin=<lat>,<lng>&destination=<lat>,<lng>
 */
export function getDirectionsUrl(
  userLat: number | null | undefined,
  userLon: number | null | undefined,
  destLat: number,
  destLon: number
): string {
  if (userLat != null && userLon != null && !isNaN(userLat) && !isNaN(userLon)) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${destLat},${destLon}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}`;
}

/**
 * Filters and sorts shelters by query, type, and proximity.
 */
export function filterAndSortShelters({
  shelters,
  searchQuery,
  selectedType,
  userCoords,
}: {
  shelters: CoolingShelter[];
  searchQuery: string;
  selectedType: ShelterType | "all";
  userCoords: { latitude: number; longitude: number } | null;
}): CoolingShelter[] {
  const query = searchQuery.trim().toLowerCase();

  const augmented = shelters.map((shelter) => {
    let distance_km: number | undefined = undefined;
    if (userCoords) {
      distance_km = computeHaversineDistance(
        userCoords.latitude,
        userCoords.longitude,
        shelter.latitude,
        shelter.longitude
      );
    }
    return { ...shelter, distance_km };
  });

  const filtered = augmented.filter((shelter) => {
    // Type filter
    if (selectedType !== "all" && shelter.type !== selectedType) {
      return false;
    }

    // Search query filter (matches name, address, or type label)
    if (query) {
      const matchName = shelter.name.toLowerCase().includes(query);
      const matchAddress = shelter.address.toLowerCase().includes(query);
      const matchType = shelter.type.toLowerCase().includes(query);
      if (!matchName && !matchAddress && !matchType) {
        return false;
      }
    }

    return true;
  });

  // Sort by distance if user coords are available; otherwise by name
  return filtered.sort((a, b) => {
    if (a.distance_km !== undefined && b.distance_km !== undefined) {
      return a.distance_km - b.distance_km;
    }
    if (a.distance_km !== undefined) return -1;
    if (b.distance_km !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}
