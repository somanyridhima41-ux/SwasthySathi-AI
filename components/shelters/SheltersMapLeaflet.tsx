"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CoolingShelter, SHELTER_TYPE_CONFIG } from "@/types/shelter";
import { formatDistance, getDirectionsUrl } from "@/lib/shelterUtils";

interface SheltersMapProps {
  shelters: CoolingShelter[];
  selectedShelter: CoolingShelter | null;
  onSelectShelter: (shelter: CoolingShelter) => void;
  userCoords: { latitude: number; longitude: number } | null;
}

export const SheltersMapLeaflet: React.FC<SheltersMapProps> = ({
  shelters,
  selectedShelter,
  onSelectShelter,
  userCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: India (or user coords / first shelter)
      const defaultCenter: [number, number] = userCoords
        ? [userCoords.latitude, userCoords.longitude]
        : shelters[0]
        ? [shelters[0].latitude, shelters[0].longitude]
        : [28.6139, 77.2090]; // Delhi NCR fallback

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: userCoords ? 13 : 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update or render user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      const userHtml = `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-500 opacity-60"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: "custom-user-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (!userMarkerRef.current) {
        const marker = L.marker([userCoords.latitude, userCoords.longitude], {
          icon: userIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        marker.bindPopup(
          `<div class="p-2 font-sans text-xs">
            <strong class="text-blue-700 font-semibold flex items-center gap-1">
              <span>📍 Your Location</span>
            </strong>
            <p class="text-stone-600 mt-0.5">Calculated via device geolocation</p>
          </div>`
        );

        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLatLng([userCoords.latitude, userCoords.longitude]);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // Update shelter markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove obsolete markers
    markersRef.current.forEach((marker, id) => {
      if (!shelters.some((s) => s.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    shelters.forEach((shelter) => {
      const isSelected = selectedShelter?.id === shelter.id;
      const typeConfig = SHELTER_TYPE_CONFIG[shelter.type];
      const color = typeConfig.pinColor;
      const directionsUrl = getDirectionsUrl(
        userCoords?.latitude,
        userCoords?.longitude,
        shelter.latitude,
        shelter.longitude
      );

      // SVG Map Pin HTML
      const markerHtml = `
        <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${
          isSelected ? "scale-125 z-50" : "hover:scale-110"
        }">
          <div style="background-color: ${color};" class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ring-2 ${
            isSelected ? "ring-black/40 ring-offset-2 scale-110 animate-pulse" : "ring-transparent"
          }">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div style="border-top-color: ${color};" class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px]"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: `shelter-marker-${shelter.id}`,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38],
      });

      let marker = markersRef.current.get(shelter.id);

      const popupContent = `
        <div class="p-2.5 font-sans min-w-[220px] max-w-[260px]">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${color};"></span>
            <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-500">${typeConfig.label}</span>
          </div>
          <h4 class="font-bold text-sm text-stone-900 leading-snug mb-1">${shelter.name}</h4>
          <p class="text-xs text-stone-600 mb-2">${shelter.address}</p>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200">
            <span class="font-medium text-emerald-700">${shelter.is_open_now ? "● Open Now" : "● Closed"}</span>
            ${shelter.distance_km !== undefined ? `<span class="font-mono text-stone-600 font-semibold">${formatDistance(shelter.distance_km)}</span>` : ""}
          </div>
          <div class="mt-2.5">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="block text-center py-1.5 px-3 rounded-lg bg-[#035657] text-white text-xs font-semibold hover:opacity-90">
              Get Directions ↗
            </a>
          </div>
        </div>
      `;

      if (!marker) {
        marker = L.marker([shelter.latitude, shelter.longitude], {
          icon: customIcon,
        }).addTo(map);

        marker.on("click", () => {
          onSelectShelter(shelter);
        });

        marker.bindPopup(popupContent, { maxWidth: 280 });
        markersRef.current.set(shelter.id, marker);
      } else {
        marker.setIcon(customIcon);
        marker.setPopupContent(popupContent);
      }
    });

    // Fit map bounds if there are shelters and map is not currently focused on a single shelter
    if (shelters.length > 0 && !selectedShelter) {
      const bounds = L.latLngBounds(
        shelters.map((s) => [s.latitude, s.longitude] as [number, number])
      );
      if (userCoords) {
        bounds.extend([userCoords.latitude, userCoords.longitude]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [shelters, selectedShelter, userCoords]);

  // Center & Open Popup when selectedShelter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedShelter) return;

    const marker = markersRef.current.get(selectedShelter.id);
    if (marker) {
      map.flyTo([selectedShelter.latitude, selectedShelter.longitude], 15, {
        duration: 0.8,
      });
      marker.openPopup();
    }
  }, [selectedShelter]);

  return (
    <div className="relative w-full h-full min-h-[350px] lg:min-h-full rounded-2xl overflow-hidden border border-surface-container shadow-sm bg-surface-container-low">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl border border-surface-container shadow-md text-xs space-y-1.5 pointer-events-auto max-w-[200px]">
        <div className="font-semibold text-on-surface text-[11px] uppercase tracking-wider text-outline mb-1">
          Shelter Types
        </div>
        {Object.entries(SHELTER_TYPE_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: config.pinColor }}
            />
            <span className="text-on-surface-variant truncate font-medium">{config.shortLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SheltersMapLeaflet;
