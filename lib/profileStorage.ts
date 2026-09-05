export type AgeGroup = "under18" | "18-40" | "41-60" | "60+";
export type OutdoorActivityLevel = "low" | "moderate" | "high";
export type SensitivityFlag = "respiratory" | "cardiovascular" | "heat" | "none";

export interface UserProfile {
  firstName: string;
  ageGroup: AgeGroup;
  location: string;
  latitude?: number;
  longitude?: number;
  outdoorActivityLevel: OutdoorActivityLevel;
  sensitivities: SensitivityFlag[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  lastSaved?: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  firstName: "Aarav",
  ageGroup: "18-40",
  location: "New Delhi, Delhi NCR",
  latitude: 28.6139,
  longitude: 77.2090,
  outdoorActivityLevel: "high",
  sensitivities: ["heat"],
  emergencyContactName: "Rajesh Sharma",
  emergencyContactPhone: "+91 98765 43210",
  lastSaved: new Date().toISOString(),
};

const STORAGE_KEY = "swasthya_sathi_user_profile_v1";

export function getStoredProfile(): UserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
    };
  } catch (err) {
    console.error("Failed to parse user profile from localStorage:", err);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const dataToSave: UserProfile = {
      ...profile,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    // Trigger custom event so other components (e.g. Dashboard) can react instantly
    window.dispatchEvent(new Event("swasthya_sathi_profile_updated"));
  } catch (err) {
    console.error("Failed to save profile to localStorage:", err);
  }
}

export function resetProfile(): UserProfile {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("swasthya_sathi_profile_updated"));
  }
  return DEFAULT_PROFILE;
}

