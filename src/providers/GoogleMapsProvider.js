// src/providers/GoogleMapsProvider.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const GoogleMapsContext = createContext();

export function GoogleMapsProvider({ children, apiKey }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // If already loaded, return early
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector("#google-maps-script")) {
      const checkExisting = setInterval(() => {
        if (window.google) {
          setIsLoaded(true);
          clearInterval(checkExisting);
        }
      }, 100);
      return () => clearInterval(checkExisting);
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => setIsLoaded(true), 100);
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      if (window.google) {
        setIsLoaded(true);
      } else {
        setLoadError(new Error("Google Maps loading timeout"));
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [apiKey]);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within GoogleMapsProvider");
  }
  return context;
};
