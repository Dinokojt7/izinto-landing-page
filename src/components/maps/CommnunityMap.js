// src/components/maps/CommunityMap.js
"use client";
import { useEffect, useRef, useState } from "react";
import { COLORS } from "@/lib/utils/constants";

export default function CommunityMap({ onAddressClick }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sandton coordinates
  const center = { lat: -26.056, lng: 28.06 };

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (!window.google) {
      // If not loaded, you might want to load it here or wait for it
      console.warn("Google Maps not loaded");
      return;
    }

    const initializeMap = () => {
      const googleMap = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        zoomControl: false,

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
            stylers: [{ visibility: "on" }],
          },
        ],
        disableDefaultUI: true,
        minZoom: 10,
        maxZoom: 16,
        disableDefaultUI: true,
        gestureHandling: "none",
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        // Add these to your map configuration
        clickableIcons: false,
        keyboardShortcuts: false,
        streetViewControl: false,
        scaleControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      // Create pulsing marker
      const createPulseMarker = () => {
        // const pulseMarker = new google.maps.Marker({
        //   position: center,
        //   map: googleMap,
        //   icon: {
        //     path: google.maps.SymbolPath.CIRCLE,
        //     scale: 10,
        //     fillColor: COLORS.blue,
        //     fillOpacity: 0.8,
        //     strokeColor: "#FFFFFF",
        //     strokeWeight: 3,
        //   },
        // });
        const imageMarker = new google.maps.Marker({
          position: center,
          map: googleMap,
          icon: {
            url: "/images/marker.png", // Path to your marker image
            scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 40), // Anchor at bottom center for pin-like behavior
          },
        });

        setMarker(imageMarker);

        // Pulsing animation
        let scale = 1;
        let growing = true;

        const pulseInterval = setInterval(() => {
          if (growing) {
            scale += 0.05;
            if (scale >= 1.4) growing = false;
          } else {
            scale -= 0.05;
            if (scale <= 1) growing = true;
          }

          pulseMarker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10 * scale,
            fillColor: COLORS.blue,
            fillOpacity: 0.9 - (scale - 1) * 0.4,
            strokeColor: "#FFFFFF",
            strokeWeight: 3,
          });
        }, 150);

        // Cleanup interval on unmount
        return { marker: pulseMarker, interval: pulseInterval };
      };

      const { marker: newMarker, interval } = createPulseMarker();

      setMap(googleMap);
      setMarker(newMarker);
      setMapLoaded(true);

      // Cleanup function
      return () => {
        clearInterval(interval);
      };
    };

    initializeMap();
  }, []);

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-70% h-[110vh] rounded-2xl shadow-lg overflow-hidden bg-gray-200"
      />

      {/* Loading state */}
      {!mapLoaded && (
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

          {/* Address Button */}
          <button
            onClick={onAddressClick}
            className="bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 w-full rounded-full text-sm sm:text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
          >
            ENTER YOUR ADDRESS
          </button>
        </div>
      </div>
    </section>
  );
}
