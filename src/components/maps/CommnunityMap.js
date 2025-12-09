// src/components/maps/CommunityMap.js
"use client";
import { useEffect, useRef, useState } from "react";
import { COLORS } from "@/lib/utils/constants";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function CommunityMap({ onAddressClick }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapInitError, setMapInitError] = useState(null);

  const { isLoaded: mapsLoaded, loadError } =
    useGoogleMaps(GOOGLE_MAPS_API_KEY);
  const center = {
    lat: -26.0538, // Morningside, Sandton coordinates
    lng: 28.0583, // Near Kelvin Dr & Rivonia Rd intersection
  };
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    try {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          // Add these road styles:
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { color: "#ffffff" }, // White roads
              { visibility: "on" },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
              { color: "#e0e0e0" }, // Light gray borders
              { weight: 0.5 },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              { color: "#ffffff" },
              { weight: 1.5 }, // Slightly wider highways
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              { color: "#ffffff" },
              { weight: 1 }, // Standard width
            ],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              { color: "#ffffff" },
              { weight: 0.7 }, // Thinner local roads
            ],
          },
          // Keep existing rules:
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: "none",
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        clickableIcons: false,
        keyboardShortcuts: false,
      });

      // Fixed marker with your image
      const marker = new window.google.maps.Marker({
        position: center,
        map: googleMap,
        icon: {
          url: "/images/map-marker.png",
          scaledSize: new window.google.maps.Size(72, 72), // Increased from 48 to 72
          anchor: new window.google.maps.Point(36, 72), // Adjusted anchor
        },
      });

      setMap(googleMap);
      setMapInitError(null);
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapInitError(error.message);
    }
  }, [mapsLoaded]);

  // Fallback content if everything fails
  if (loadError || mapInitError) {
    return (
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
        <div className="w-full h-[50vh] sm:h-[70vh] rounded-2xl shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 mb-4">Map unavailable</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Map Container - Responsive height */}
      <div
        ref={mapRef}
        className="w-full h-[70vh] sm:h-[80vh] lg:h-[118vh] rounded-2xl shadow-lg overflow-hidden bg-gray-200"
      />

      {/* Loading overlay */}
      {!mapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}

      {/* Stacked Container - Longer and properly sized */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto pl-6 sm:w-96 lg:w-full lg:max-w-lg">
        <div className="bg-white/70 rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 h-80 sm:h-72 lg:h-88 flex flex-col justify-start items-start text-start">
          {/* Main Blue Text - Properly truncated */}

          <h2
            className="text-4xl lg:text-4xl font-black italic text-black mb-4 lg:mb-6 leading-tight"
            style={{ color: COLORS.blue }}
          >
            YOUR COMMUNITY COUNTS ON IZINTO - JOIN THEM.
          </h2>

          {/* Smaller Grey Text - Proper width */}
          <p className="text-sm sm:text-base text-gray-800 font-bold mb-6 sm:mb-8 max-w-xs sm:max-w-sm lg:max-w-lg warap-break-words">
            From your trusted service providers. Serviced as fast as 45 minutes.
          </p>

          {/* Button - Full width within container */}
          <button
            onClick={onAddressClick}
            className="bg-[#0000ff] text-white px-6 sm:px-8 py-3 sm:py-4 w-full max-w-xs sm:max-w-sm rounded-full text-sm sm:text-base font-extrabold italic hover:bg-[#0000cc] transition-all transform whitespace-nowrap"
          >
            ENTER YOUR ADDRESS
          </button>
        </div>
      </div>
    </section>
  );
}
