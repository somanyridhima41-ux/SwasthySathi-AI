import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { computeRisk, computeDisasterWarnings } from "../lib/riskEngine";

describe("SwasthyaSathi AI Deterministic Risk Engine (SIH26181)", () => {

  test("Scenario 1: Severe Diurnal Heatwave (IMD Red Alert)", () => {
    const risk = computeRisk({
      temperatureC: 43,
      feelsLikeC: 47,
      humidityPct: 45,
      aqi: 140,
      ageGroup: "41-60",
      outdoorActivityLevel: "high",
      sensitivities: ["heat"],
    });

    assert.strictEqual(risk.level, "Critical", "Should escalate to Critical risk under severe heat with high exertion");
    assert.match(risk.primaryDriver, /thermal|heat/i, "Driver must cite thermal stress");
    assert.ok(risk.recommendations.some(r => r.includes("electrolyte") || r.includes("fluid")), "Must include electrolyte hydration protocol");
    assert.ok(risk.recommendations.some(r => r.includes("solar") || r.includes("shade") || r.includes("labor")), "Must advise halting midday solar exertion");

    const warnings = computeDisasterWarnings({
      temperatureC: 43,
      feelsLikeC: 47,
      humidityPct: 45,
      aqi: 140,
    });

    const heatWarning = warnings.find(w => w.hazardType === "heat");
    assert.ok(heatWarning, "Must generate a heat disaster alert");
    assert.strictEqual(heatWarning?.severity, "critical", "Heat warning must be critical severity");
    assert.match(heatWarning?.title || "", /IMD Red Alert/i, "Must identify as IMD Red Alert");
  });

  test("Scenario 2: Toxic Particulate Smog Inversion (CPCB Red Alert)", () => {
    const risk = computeRisk({
      temperatureC: 19,
      feelsLikeC: 19,
      humidityPct: 55,
      aqi: 360,
      ageGroup: "18-40",
      outdoorActivityLevel: "moderate",
      sensitivities: ["respiratory"],
    });

    assert.ok(risk.level === "High" || risk.level === "Critical", "Should escalate to High or Critical under toxic smog for asthma patients");
    assert.match(risk.primaryDriver, /particulate|AQI|respiratory/i, "Driver must cite particulate air pollution");
    assert.ok(risk.recommendations.some(r => r.includes("N95") || r.includes("filtration")), "Must recommend N95 respirator or air filtration");

    const warnings = computeDisasterWarnings({
      temperatureC: 19,
      feelsLikeC: 19,
      humidityPct: 55,
      aqi: 360,
      pm25: 220,
    });

    const aqiWarning = warnings.find(w => w.hazardType === "aqi");
    assert.ok(aqiWarning, "Must generate an AQI disaster alert");
    assert.strictEqual(aqiWarning?.severity, "critical", "AQI warning must be critical severity");
    assert.match(aqiWarning?.title || "", /CPCB Red Alert/i, "Must identify as CPCB Red Alert");
  });

  test("Scenario 3: Normal Baseline Spring Meteorology", () => {
    const risk = computeRisk({
      temperatureC: 24,
      feelsLikeC: 24,
      humidityPct: 42,
      aqi: 45,
      ageGroup: "18-40",
      outdoorActivityLevel: "low",
      sensitivities: ["none"],
    });

    assert.strictEqual(risk.level, "Low", "Should evaluate as Low risk under normal weather and AQI");
    assert.match(risk.primaryDriver, /baseline|tolerance/i, "Driver must reflect normal baseline");

    const warnings = computeDisasterWarnings({
      temperatureC: 24,
      feelsLikeC: 24,
      humidityPct: 42,
      aqi: 45,
    });

    assert.strictEqual(warnings.length, 1, "Should have exactly 1 warning (baseline status)");
    assert.strictEqual(warnings[0].severity, "normal", "Baseline status must be normal");
    assert.match(warnings[0].title, /No Active Meteorological Disaster/i, "Must confirm absence of disaster alerts");
  });

  test("Scenario 4: Coastal Wet-Bulb Humidity Trap (Senior Citizen with Cardiovascular Sensitivity)", () => {
    const risk = computeRisk({
      temperatureC: 34,
      feelsLikeC: 42,
      humidityPct: 82,
      aqi: 75,
      ageGroup: "60+",
      outdoorActivityLevel: "moderate",
      sensitivities: ["cardiovascular", "heat"],
    });

    assert.ok(risk.level === "High" || risk.level === "Critical", "Should escalate to High or Critical for senior cardiac patient under high wet-bulb index");
    assert.ok(risk.recommendations.some(r => r.includes("pulse") || r.includes("heart rate")), "Must include heart rate monitoring for cardiac patients");

    const warnings = computeDisasterWarnings({
      temperatureC: 34,
      feelsLikeC: 42,
      humidityPct: 82,
      aqi: 75,
    });

    const humidityWarning = warnings.find(w => w.hazardType === "humidity");
    assert.ok(humidityWarning, "Must detect wet-bulb high humidity heat trap");
    assert.match(humidityWarning?.title || "", /Wet-Bulb/i, "Must title as Wet-Bulb Trap");
  });

  test("Scenario 5: Convective Severe Thunderstorm & Lightning Hazard", () => {
    const warnings = computeDisasterWarnings({
      temperatureC: 28,
      feelsLikeC: 30,
      humidityPct: 70,
      aqi: 80,
      weatherCode: 95, // WMO Thunderstorm
      weatherDescription: "Thunderstorm with heavy rain",
    });

    const stormWarning = warnings.find(w => w.hazardType === "flood");
    assert.ok(stormWarning, "Must detect convective thunderstorm alert");
    assert.match(stormWarning?.title || "", /Thunderstorm/i, "Must title as Severe Thunderstorm Alert");
    assert.match(stormWarning?.actionGuidance || "", /indoor shelter|lightning/i, "Must include lightning safety advice");
  });

});
