import { useEffect, useState } from "react";

export const useGoogleMaps = (apiKey) => {
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
      // Wait for existing script to load
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
      // Small delay to ensure complete initialization
      setTimeout(() => setIsLoaded(true), 100);
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);

    // Fallback: check if loaded after 5 seconds
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

  return { isLoaded, loadError };
};
