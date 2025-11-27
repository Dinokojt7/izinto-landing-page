// src/components/maps/CommunityMap.js
"use client";
import { useEffect, useRef, useState } from "react";
import { COLORS } from "@/lib/utils/constants";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Make sure this is set

export default function CommunityMap({ onAddressClick }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapInitError, setMapInitError] = useState(null);

  const { isLoaded: mapsLoaded, loadError } =
    useGoogleMaps(GOOGLE_MAPS_API_KEY);
  const center = { lat: -26.056, lng: 28.06 };

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

      // Simple static marker - no animations that could fail
      const marker = new window.google.maps.Marker({
        position: center,
        map: googleMap,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2C12.268 2 6 8.268 6 16C6 26 20 40 20 40C20 40 34 26 34 16C34 8.268 27.732 2 20 2Z" fill="${COLORS.blue}"/>
              <circle cx="20" cy="16" r="5" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
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
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="w-full h-[70vh] rounded-2xl shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
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
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-70% h-[110vh] rounded-2xl shadow-lg overflow-hidden bg-gray-200"
      />

      {/* Loading overlay */}
      {!mapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}

      {/* Stacked Container - Top Left */}
      <div className="absolute top-6 left-6 right-6 sm:left-8 sm:right-auto w-auto sm:w-full max-w-lg">
        <div className="bg-white/70 rounded-2xl shadow-xl p-4 sm:p-5 h-auto sm:h-80 flex flex-col justify-center items-center text-center">
          {/* Main Blue Text */}
          <h2
            className="text-xl sm:text-2xl lg:text-4xl font-extrabold italic mb-3 sm:mb-4 leading-tight"
            style={{ color: COLORS.blue }}
          >
            YOUR COMMUNITY COUNTS ON IZINTO - JOIN THEM.
          </h2>

          {/* Smaller Grey Text */}
          <p className="text-sm text-gray-800 font-bold mb-4 sm:mb-6 max-w-lg sm:max-w-lg">
            From your trusted service providers. Serviced as fast as 45 minutes.
          </p>
          <button
            onClick={onAddressClick}
            className="bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-4 w-full rounded-full text-sm sm:text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
          >
            ENTER YOUR ADDRESS
          </button>
        </div>
      </div>
    </section>
  );
}
