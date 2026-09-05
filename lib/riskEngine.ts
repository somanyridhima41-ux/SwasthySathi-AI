/**
 * SwasthyaSathi AI Deterministic Personal Risk Engine (SIH26181)
 * 
 * CORE PRINCIPLE:
 * Translates generic environmental telemetry into individualized health risk levels
 * through transparent, clinically backed multi-factor weighting.
 * 
 * Logic Chain:
 * Environmental Data (T, Feels-Like, RH, AQI)
 *   + User Profile (Age bracket, Outdoor Exposure, Sensitivities)
 *   -> Deterministic Base Severity
 *   -> Sensitivity & Exposure Multipliers
 *   -> Final Clinical Risk Tier (Low, Moderate, High, Critical)
 *   -> Transparent Primary Driver & Concrete Preventive Protocols
 */

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface RiskEngineInput {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  aqi: number;
  ageGroup: "under18" | "18-40" | "41-60" | "60+";
  outdoorActivityLevel: "low" | "moderate" | "high";
  sensitivities: string[]; // e.g. ['respiratory', 'cardiovascular', 'heat']
}

export interface RiskEngineResult {
  level: RiskLevel;
  primaryDriver: string;
  recommendations: string[];
  rawScore: number;
  subScores: {
    thermalStress: number;
    particulateStrain: number;
    exposureMultiplier: number;
    vulnerabilityEscalation: number;
  };
}

/**
 * Computes individual health risk level from environmental and personal parameters.
 * Pure, deterministic function suitable for both client and edge execution.
 */
export function computeRisk(input: {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  aqi: number;
  ageGroup: "under18" | "18-40" | "41-60" | "60+";
  outdoorActivityLevel: "low" | "moderate" | "high";
  sensitivities: string[];
}): {
  level: RiskLevel;
  primaryDriver: string;
  recommendations: string[];
} {
  const {
    temperatureC,
    feelsLikeC,
    humidityPct,
    aqi,
    ageGroup,
    outdoorActivityLevel,
    sensitivities,
  } = input;

  const hasSensitivity = (type: string) => sensitivities.includes(type);

  // -------------------------------------------------------------
  // 1. THERMAL STRESS SUB-SCORE (1.0 to 4.0)
  // Based on NOAA / Indian Meteorological Dept (IMD) Heat Index categories
  // -------------------------------------------------------------
  let thermalStress = 1.0;
  const effectiveTemp = Math.max(temperatureC, feelsLikeC);

  if (effectiveTemp >= 43 || (temperatureC >= 38 && humidityPct >= 65)) {
    // Extreme heatwave & wet-bulb danger (sweat cannot evaporate effectively)
    thermalStress = 4.0;
  } else if (effectiveTemp >= 38 || (temperatureC >= 34 && humidityPct >= 60)) {
    // Severe heat stress
    thermalStress = 3.0;
  } else if (effectiveTemp >= 32 || (temperatureC >= 30 && humidityPct >= 70)) {
    // Caution / moderate thermal workload
    thermalStress = 2.0;
  } else {
    thermalStress = 1.0;
  }

  // -------------------------------------------------------------
  // 2. PARTICULATE & AIR QUALITY SUB-SCORE (1.0 to 4.0)
  // Based on Indian National Air Quality Index (CPCB) Breakpoints
  // -------------------------------------------------------------
  let particulateStrain = 1.0;

  if (aqi > 300) {
    // Severe / Hazardous (emergency conditions)
    particulateStrain = 4.0;
  } else if (aqi >= 201) {
    // Very Poor / Unhealthy
    particulateStrain = 3.0;
  } else if (aqi >= 101) {
    // Moderate / Unhealthy for Sensitive Groups
    particulateStrain = 2.0;
  } else {
    // Good / Satisfactory
    particulateStrain = 1.0;
  }

  // Determine the baseline environmental hazard
  let baseScore = Math.max(thermalStress, particulateStrain);

  // Compound penalty: if BOTH heat and AQI are elevated simultaneously
  if (thermalStress >= 2.5 && particulateStrain >= 2.5) {
    baseScore += 0.5;
  }

  // -------------------------------------------------------------
  // 3. EXPOSURE MODIFIER (0.7 to 1.3)
  // Indoor air conditioning mitigates heat; outdoor labor amplifies dose
  // -------------------------------------------------------------
  let exposureMultiplier = 1.0;
  if (outdoorActivityLevel === "high") {
    // Outdoor physical laborers: direct sun insolation & high minute-ventilation
    exposureMultiplier = 1.25;
  } else if (outdoorActivityLevel === "moderate") {
    // Commuters / intermittent outdoors
    exposureMultiplier = 1.0;
  } else {
    // Indoors / sedentary office
    exposureMultiplier = 0.8;
  }

  // -------------------------------------------------------------
  // 4. BIOLOGICAL VULNERABILITY ESCALATION (0.0 to 2.0)
  // Age-related thermoregulatory and cardiovascular sensitivity
  // -------------------------------------------------------------
  let vulnerabilityEscalation = 0.0;

  // Age group factor
  if (ageGroup === "60+") {
    // Reduced baroreceptor reflex, diminished thirst sensation, cardiovascular reserve
    if (thermalStress >= 2.0 || particulateStrain >= 2.0) {
      vulnerabilityEscalation += 0.75;
    }
  } else if (ageGroup === "under18") {
    // High metabolic heat production, smaller fluid reservoir
    if (thermalStress >= 2.5) {
      vulnerabilityEscalation += 0.4;
    }
  } else if (ageGroup === "41-60") {
    if (thermalStress >= 3.0 || particulateStrain >= 3.0) {
      vulnerabilityEscalation += 0.3;
    }
  }

  // Specific clinical sensitivity escalations
  if (hasSensitivity("heat") && thermalStress >= 2.0) {
    vulnerabilityEscalation += 0.75;
  }

  if (hasSensitivity("cardiovascular")) {
    // Heat causes peripheral vasodilation & high cardiac output; PM2.5 causes arterial vasoconstriction
    if (thermalStress >= 2.5 || particulateStrain >= 2.0) {
      vulnerabilityEscalation += 0.85;
    }
  }

  if (hasSensitivity("respiratory")) {
    // PM2.5/PM10 triggers acute bronchospasm and micro-alveolar inflammation
    if (particulateStrain >= 2.0) {
      vulnerabilityEscalation += 0.85;
    }
  }

  // -------------------------------------------------------------
  // 5. FINAL SCORE & TIER DETERMINATION
  // -------------------------------------------------------------
  const finalScore = (baseScore * exposureMultiplier) + vulnerabilityEscalation;

  let level: RiskLevel = "Low";
  if (finalScore >= 3.8) {
    level = "Critical";
  } else if (finalScore >= 2.8) {
    level = "High";
  } else if (finalScore >= 1.8) {
    level = "Moderate";
  } else {
    level = "Low";
  }

  // -------------------------------------------------------------
  // 6. EXPLAINABLE PRIMARY DRIVER GENERATION
  // -------------------------------------------------------------
  let primaryDriver = "";
  const isHeatDominant = thermalStress >= particulateStrain;

  if (level === "Critical") {
    if (isHeatDominant) {
      primaryDriver = `Dangerous thermal index (${effectiveTemp}°C feels-like) combined with your ${outdoorActivityLevel} outdoor exertion and age/sensitivity parameters pushes heat exhaustion and acute dehydration risk to critical thresholds.`;
    } else {
      primaryDriver = `Toxic particulate concentration (AQI ${aqi}) coupled with your sensitivity profile presents an acute hazard for airway constriction and cardiovascular overstrain.`;
    }
  } else if (level === "High") {
    if (isHeatDominant) {
      primaryDriver = `High ambient heat (${effectiveTemp}°C) with ${humidityPct}% humidity accelerates sweat loss and circulatory fatigue, heightened by your outdoor exposure pattern.`;
    } else {
      primaryDriver = `Elevated particulate pollution (AQI ${aqi}) exceeds safe physiological limits for your profile, increasing mucosal inflammation and respiratory reactivity.`;
    }
  } else if (level === "Moderate") {
    if (isHeatDominant) {
      primaryDriver = `Warm microclimate (${effectiveTemp}°C) may induce mild heat fatigue and dehydration during extended commutes or workouts.`;
    } else {
      primaryDriver = `Moderate particulate levels (AQI ${aqi}) may cause mild throat or ocular irritation; baseline preventive hydration and pacing recommended.`;
    }
  } else {
    primaryDriver = `Atmospheric conditions (${temperatureC}°C, AQI ${aqi}) remain within your personalized physiological tolerance baseline.`;
  }

  // -------------------------------------------------------------
  // 7. CONCRETE PREVENTIVE RECOMMENDATIONS
  // -------------------------------------------------------------
  const recommendations: string[] = [];

  // Hydration dosing
  if (thermalStress >= 3.0 || (outdoorActivityLevel === "high" && thermalStress >= 2.0)) {
    recommendations.push("Drink 350–400 mL of electrolyte-fortified fluid every 30 minutes. Avoid relying solely on unmineralized water during heavy sweating.");
  } else if (thermalStress >= 2.0) {
    recommendations.push("Maintain proactive fluid intake of 250 mL per hour, even before the sensation of thirst occurs.");
  } else {
    recommendations.push("Maintain baseline daily hydration target of 2.2 to 2.8 liters.");
  }

  // Activity & shelter timing
  if (level === "Critical" || level === "High") {
    if (thermalStress >= 2.5) {
      recommendations.push("Halt direct solar physical labor between 12:00 PM and 3:30 PM. Mandate 15-minute shaded cooling intervals.");
    }
  }

  // Respiratory / mask guidance
  if (particulateStrain >= 3.0 || (particulateStrain >= 2.0 && hasSensitivity("respiratory"))) {
    recommendations.push("Wear a properly fitted N95 respirator during outdoor transit. Keep domestic windows closed with indoor air filtration active.");
  } else if (particulateStrain >= 2.0) {
    recommendations.push("Shift vigorous cardiovascular workouts from outdoor roads to indoor spaces.");
  }

  // Sensitive demographic checks
  if (hasSensitivity("cardiovascular") || ageGroup === "60+") {
    if (level === "High" || level === "Critical") {
      recommendations.push("Monitor resting pulse every 2 hours. If resting heart rate exceeds 95 BPM with dizziness, retreat to cool shelter and inform your emergency contact.");
    }
  }

  // Ensure 2 to 4 recommendations
  if (recommendations.length < 2) {
    recommendations.push("Monitor local hourly temperature shifts before planning prolonged transit.");
  }

  return {
    level,
    primaryDriver,
    recommendations: recommendations.slice(0, 4),
  };
}

export interface DisasterWarning {
  id: string;
  title: string;
  severity: "critical" | "high" | "moderate" | "normal";
  hazardType: "heat" | "aqi" | "flood" | "humidity" | "normal";
  shortExplanation: string;
  actionGuidance: string;
}

/**
 * Evaluates hyper-local meteorological and air quality telemetry against
 * IMD (India Meteorological Department) and CPCB disaster warning thresholds.
 */
export function computeDisasterWarnings(input: {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  aqi: number;
  weatherCode?: number;
  weatherDescription?: string;
  pm25?: number;
}): DisasterWarning[] {
  const {
    temperatureC,
    feelsLikeC,
    humidityPct,
    aqi,
    weatherCode = 0,
    weatherDescription = "",
    pm25 = 0,
  } = input;

  const warnings: DisasterWarning[] = [];

  // 1. Extreme Heat Wave Warning (IMD Heatwave Criteria)
  const effectiveTemp = Math.max(temperatureC, feelsLikeC);
  if (effectiveTemp >= 43 || temperatureC >= 42) {
    warnings.push({
      id: "heat-wave-severe",
      title: "IMD Red Alert: Severe Heat Wave",
      severity: "critical",
      hazardType: "heat",
      shortExplanation: `Ambient temperature of ${temperatureC}°C (Feels like ${feelsLikeC}°C) exceeds critical biological thermoregulation thresholds.`,
      actionGuidance: "Suspend strenuous outdoor labor. Access shaded cooling centers and ingest electrolyte rehydration fluids.",
    });
  } else if (effectiveTemp >= 38 || temperatureC >= 37) {
    warnings.push({
      id: "heat-wave-moderate",
      title: "IMD Orange Alert: Heat Wave Advisory",
      severity: "high",
      hazardType: "heat",
      shortExplanation: `Elevated thermal stress (${temperatureC}°C, Feels like ${feelsLikeC}°C) accelerates dehydration and cardiovascular fatigue.`,
      actionGuidance: "Pre-hydrate with 350-400 mL water every 40 minutes and limit direct solar exposure between 11:30 AM and 3:30 PM.",
    });
  }

  // 2. Toxic Particulate Pollution Alert (CPCB National AQI Standards)
  if (aqi >= 300) {
    warnings.push({
      id: "aqi-severe",
      title: "CPCB Red Alert: Hazardous Particulate Smog",
      severity: "critical",
      hazardType: "aqi",
      shortExplanation: `Hazardous AQI of ${aqi} (PM2.5: ${pm25 || "Elevated"} µg/m³) triggers acute bronchial reactivity and systemic inflammation.`,
      actionGuidance: "Wear certified N95 respirators outdoors. Maintain indoor HEPA air purification and avoid open-air aerobic exercise.",
    });
  } else if (aqi >= 200) {
    warnings.push({
      id: "aqi-poor",
      title: "CPCB Orange Alert: Very Poor Air Quality",
      severity: "high",
      hazardType: "aqi",
      shortExplanation: `High particulate smog (${aqi} AQI) causes nasal and ocular mucosa irritation and exacerbates latent respiratory conditions.`,
      actionGuidance: "Sensitive groups should remain indoors with windows closed. Limit continuous outdoor exposure to under 30 minutes.",
    });
  }

  // 3. Monsoon Cloudburst / Flash Flood / Severe Thunderstorm Advisory
  if (weatherCode >= 95) {
    warnings.push({
      id: "storm-thunder",
      title: "Convective Severe Thunderstorm & Lightning Alert",
      severity: "high",
      hazardType: "flood",
      shortExplanation: "Severe convective storm activity with squally gusts and lightning discharge. High risk of localized power disruption and flash flooding.",
      actionGuidance: "Stay clear of tall trees, power lines, and open metal structures. Remain in sturdy indoor shelter until squalls pass.",
    });
  } else if (weatherCode >= 80 || (weatherCode >= 61 && weatherCode <= 65)) {
    warnings.push({
      id: "monsoon-rain",
      title: "Intense Monsoon Precipitation & Urban Inundation Advisory",
      severity: "moderate",
      hazardType: "flood",
      shortExplanation: `Heavy rainfall (${weatherDescription || "Monsoon showers"}) may overwhelm urban storm drains, leading to road waterlogging.`,
      actionGuidance: "Avoid traversing waterlogged streets due to open manhole hazards and contaminated stormwater runoff.",
    });
  }

  // 4. Wet-Bulb Humidity Trap (High RH + High Temp)
  if (humidityPct >= 75 && temperatureC >= 32) {
    warnings.push({
      id: "wet-bulb-trap",
      title: "Wet-Bulb High-Humidity Heat Trap",
      severity: "high",
      hazardType: "humidity",
      shortExplanation: `High ambient humidity (${humidityPct}%) arrests cutaneous sweat evaporation, causing rapid internal heat retention.`,
      actionGuidance: "Operate fans or cross-ventilation, wear lightweight breathable cotton, and apply damp cloth compresses to pulse points.",
    });
  }

  // 5. Normal Baseline if no alerts triggered
  if (warnings.length === 0) {
    warnings.push({
      id: "baseline-normal",
      title: "No Active Meteorological Disaster Alerts",
      severity: "normal",
      hazardType: "normal",
      shortExplanation: `Atmospheric parameters (${temperatureC}°C, AQI ${aqi}) are within standard physiological baseline limits for this region.`,
      actionGuidance: "Follow standard seasonal hydration habits and daily outdoor schedules without special meteorological restrictions.",
    });
  }

  return warnings;
}

