import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { 
  computeHaversineDistance, 
  formatDistance, 
  getDirectionsUrl, 
  filterAndSortShelters 
} from "../lib/shelterUtils";
import { CoolingShelter } from "../types/shelter";

describe("Cooling Shelters Utilities & Proximity Engine (SIH26181)", () => {

  test("Haversine distance calculation is accurate", () => {
    // Connaught Place (28.6315, 77.2167) to RML Hospital (28.6253, 77.2008) ~ 1.7 km
    const dist = computeHaversineDistance(28.6315, 77.2167, 28.6253, 77.2008);
    assert.ok(dist >= 1.5 && dist <= 1.9, `Distance was ${dist} km, expected ~1.7 km`);

    // Zero distance for identical coordinates
    const zeroDist = computeHaversineDistance(28.6315, 77.2167, 28.6315, 77.2167);
    assert.strictEqual(zeroDist, 0);
  });

  test("formatDistance formats meters and kilometers properly", () => {
    assert.strictEqual(formatDistance(0.45), "450 m away");
    assert.strictEqual(formatDistance(2.38), "2.4 km away");
    assert.strictEqual(formatDistance(undefined), "Distance unknown");
  });

  test("getDirectionsUrl generates valid Google Maps navigation URL", () => {
    const url = getDirectionsUrl(28.6139, 77.2090, 28.6315, 77.2167);
    assert.strictEqual(
      url,
      "https://www.google.com/maps/dir/?api=1&origin=28.6139,77.209&destination=28.6315,77.2167"
    );

    const fallbackUrl = getDirectionsUrl(null, null, 28.6315, 77.2167);
    assert.strictEqual(
      fallbackUrl,
      "https://www.google.com/maps/dir/?api=1&destination=28.6315,77.2167"
    );
  });

  test("filterAndSortShelters filters by type and search query, and sorts by proximity", () => {
    const sampleShelters: CoolingShelter[] = [
      {
        id: "1",
        name: "Connaught Place Cooling Oasis",
        type: "cooling_center",
        latitude: 28.6315,
        longitude: 77.2167,
        address: "Sansad Marg, New Delhi",
        capacity: 100,
        phone_number: "+91 11 1234 5678",
        is_open_now: true,
      },
      {
        id: "2",
        name: "Majestic Night Shelter",
        type: "night_shelter",
        latitude: 12.9767,
        longitude: 77.5713,
        address: "Majestic, Bengaluru",
        capacity: 80,
        phone_number: "+91 80 1234 5678",
        is_open_now: true,
      },
      {
        id: "3",
        name: "Hauz Khas PHC",
        type: "phc",
        latitude: 28.5494,
        longitude: 77.2001,
        address: "Hauz Khas, New Delhi",
        capacity: 40,
        phone_number: null,
        is_open_now: true,
      }
    ];

    // Filter by type
    const coolingOnly = filterAndSortShelters({
      shelters: sampleShelters,
      searchQuery: "",
      selectedType: "cooling_center",
      userCoords: null,
    });
    assert.strictEqual(coolingOnly.length, 1);
    assert.strictEqual(coolingOnly[0].id, "1");

    // Filter by text search
    const delhiQuery = filterAndSortShelters({
      shelters: sampleShelters,
      searchQuery: "Hauz",
      selectedType: "all",
      userCoords: null,
    });
    assert.strictEqual(delhiQuery.length, 1);
    assert.strictEqual(delhiQuery[0].name, "Hauz Khas PHC");

    // Proximity sorting from Central Delhi (28.63, 77.21)
    const userLocation = { latitude: 28.63, longitude: 77.21 };
    const sorted = filterAndSortShelters({
      shelters: sampleShelters,
      searchQuery: "",
      selectedType: "all",
      userCoords: userLocation,
    });
    assert.strictEqual(sorted[0].id, "1", "Nearest should be Connaught Place");
    assert.strictEqual(sorted[1].id, "3", "Second should be Hauz Khas");
    assert.strictEqual(sorted[2].id, "2", "Farthest should be Bengaluru Majestic");
    assert.ok(sorted[0].distance_km! < sorted[1].distance_km!);
  });

});
