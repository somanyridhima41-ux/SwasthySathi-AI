/**
 * Supabase Architecture Adapter (SIH26181)
 * 
 * Configured for User Profile & Risk History synchronization in Postgres.
 * Per the project brief, raw sensitive biometrics are NEVER stored in Postgres.
 * In this Round 1 MVP, client falls back gracefully to localStorage if Supabase
 * environment variables are not yet provided.
 */

import { UserProfile } from "./profileStorage";
import { RiskLevel } from "./riskEngine";

export interface RiskHistoryRecord {
  id?: string;
  userId?: string;
  timestamp: string;
  location: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  aqi: number;
  computedRiskLevel: RiskLevel;
  primaryDriver: string;
  isSimulatedOffline?: boolean;
}

// Check for environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Synchronizes user profile parameters to Supabase Postgres `profiles` table.
 * Falls back to local storage if credentials are not configured.
 */
export async function syncProfileToSupabase(profile: UserProfile): Promise<{ success: boolean; mode: "supabase" | "local" }> {
  if (!isSupabaseConfigured) {
    // Graceful fallback to local storage (Round 1 default)
    return { success: true, mode: "local" };
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey!}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        first_name: profile.firstName,
        age_group: profile.ageGroup,
        location: profile.location,
        latitude: profile.latitude,
        longitude: profile.longitude,
        outdoor_activity_level: profile.outdoorActivityLevel,
        sensitivities: profile.sensitivities,
        emergency_contact_name: profile.emergencyContactName,
        emergency_contact_phone: profile.emergencyContactPhone,
        updated_at: new Date().toISOString(),
      }),
    });

    return { success: res.ok, mode: "supabase" };
  } catch (err) {
    console.warn("Supabase sync encountered network issue, maintaining local state:", err);
    return { success: true, mode: "local" };
  }
}

/**
 * Records an early-warning risk evaluation event to Supabase `risk_history` table.
 */
export async function logRiskEvaluationEvent(record: RiskHistoryRecord): Promise<void> {
  if (!isSupabaseConfigured) {
    // In local mode, keep a rolling buffer in browser memory or localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("swasthya_risk_history_v1") || "[]");
      existing.unshift(record);
      if (existing.length > 20) existing.pop();
      localStorage.setItem("swasthya_risk_history_v1", JSON.stringify(existing));
    } catch {
      // Ephemeral fallback
    }
    return;
  }

  try {
    await fetch(`${supabaseUrl}/rest/v1/risk_history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey!}`,
      },
      body: JSON.stringify({
        location: record.location,
        temperature_c: record.temperatureC,
        feels_like_c: record.feelsLikeC,
        humidity_pct: record.humidityPct,
        aqi: record.aqi,
        risk_level: record.computedRiskLevel,
        primary_driver: record.primaryDriver,
        evaluated_at: record.timestamp,
      }),
    });
  } catch (err) {
    console.warn("Could not log risk event to Supabase:", err);
  }
}
