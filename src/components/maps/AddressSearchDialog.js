// src/components/maps/AddressSearchDialog.js
"use client";
import { useState, useEffect, useRef } from "react";
import { COLORS } from "@/lib/utils/constants";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { useAddress } from "@/providers/AddressProvider";

export default function AddressSearchDialog({
  isOpen,
  onClose,
  onAddressSave,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [showSearching, setShowSearching] = useState(false);
  const { saveAddress } = useAddress();

  const mapRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Use the shared Google Maps hook from provider
  const { isLoaded: isGoogleLoaded, loadError } = useGoogleMaps();

  // Initialize Google services when loaded
  useEffect(() => {
    if (isGoogleLoaded && window.google) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(
        document.createElement("div"),
      );
    }
  }, [isGoogleLoaded]);

  // Initialize map when address is selected
  useEffect(() => {
    if (selectedAddress && mapRef.current && !map && isGoogleLoaded) {
      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: selectedAddress.lat, lng: selectedAddress.lng },
        zoom: 15,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
        ],
      });

      // Add pulsing marker
      const newMarker = new google.maps.Marker({
        position: { lat: selectedAddress.lat, lng: selectedAddress.lng },
        map: googleMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8, // Slightly smaller
          fillColor: COLORS.blue, // Use the light blue info color
          fillOpacity: 0.9,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
        // Remove bounce animation, we'll create pulse with CSS-like effect
      });

      setMap(googleMap);
      setMarker(newMarker);
    }
  }, [selectedAddress, map, isGoogleLoaded]);

  // Load saved address on open
  useEffect(() => {
    if (isOpen) {
      const savedAddress = localStorage.getItem("userAddress");
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        setSelectedAddress(addressData);
        setSearchQuery(`${addressData.street}, ${addressData.town}`);
        setIsValidAddress(addressData.isValid);
        setStatusText(
          addressData.isValid
            ? "😎 Yay we're available in your area!"
            : "💔 Oops! we're not available in this area!",
        );
      }
    }
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateAddress = async (lat, lng) => {
    try {
      const refLat = -26.056;
      const refLng = 28.06;

      const distance = calculateDistance(lat, lng, refLat, refLng);
      return distance <= 20;
    } catch (error) {
      console.error("Error validating address:", error);
      return false;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setPredictions([]);
      setShowSearching(false);
      return;
    }

    if (!autocompleteService.current || !isGoogleLoaded) {
      setPredictions([]);
      setShowSearching(false);
      return;
    }

    setIsLoading(true);

    try {
      const request = {
        input: query,
        componentRestrictions: { country: "za" },
        types: ["address"],
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const formattedPredictions = predictions.map((prediction) => ({
              id: prediction.place_id,
              street: prediction.structured_formatting.main_text,
              town: prediction.structured_formatting.secondary_text || "",
              placeId: prediction.place_id,
            }));
            setPredictions(formattedPredictions);
          } else {
            setPredictions([]);
          }
          setIsLoading(false);
          setShowSearching(false);
        },
      );
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setIsLoading(false);
      setShowSearching(false);
    }
  };

  const handleSelectAddress = async (prediction) => {
    if (!placesService.current || !isGoogleLoaded) {
      console.log("Google Places not loaded");
      return;
    }

    setIsLoading(true);

    try {
      placesService.current.getDetails(
        {
          placeId: prediction.placeId,
          fields: ["formatted_address", "geometry", "address_components"],
        },
        async (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const address = {
              id: prediction.placeId,
              street: prediction.street,
              town: prediction.town,
              fullAddress: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            setSelectedAddress(address);
            setSearchQuery(`${prediction.street}, ${prediction.town}`);
            setPredictions([]);

            const isValid = await validateAddress(address.lat, address.lng);
            setIsValidAddress(isValid);
            setStatusText(
              isValid
                ? "😎 Yay we're available in your area!"
                : "💔 Oops! we're not available in this area!",
            );
          } else {
            console.log("Place details error:", status);
          }
          setIsLoading(false);
        },
      );
    } catch (error) {
      console.error("Error getting place details:", error);
      setIsLoading(false);
    }
  };

  const handleSaveAddress = () => {
    if (selectedAddress) {
      const addressData = {
        street: selectedAddress.street,
        town: selectedAddress.town,
        suburb: selectedAddress.suburb || selectedAddress.town,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
        isValid: isValidAddress,
        // Add other fields as needed
        country: "South Africa",
        zip: "", // You might want to extract from Google Places
        additionalInfo: "",
        label: "Home", // Or let user choose
        selected: true,
      };

      saveAddress(addressData);
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (
      selectedAddress &&
      value !== `${selectedAddress.street}, ${selectedAddress.town}`
    ) {
      setSelectedAddress(null);
      setIsValidAddress(false);
      setStatusText("");
      if (map) {
        if (marker) {
          marker.setMap(null);
          setMarker(null);
        }
        setMap(null);
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (
        !selectedAddress ||
        searchQuery !== `${selectedAddress.street}, ${selectedAddress.town}`
      ) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedAddress, isGoogleLoaded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 text-black">
          <h2
            className={`text-3xl font-extrabold italic ${selectedAddress ? "text-primary" : "text-primary"}`}
          >
            {!selectedAddress ? "ADD NEW ADDRESS." : "Add new address."}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-900 p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Status Message */}
            {statusText && (
              <div
                className="mb-4 px-4 py-1 text-white rounded-lg text-center"
                style={{ backgroundColor: COLORS.accent }}
              >
                {statusText}
              </div>
            )}

            {/* Search Input */}
            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Start typing your address..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-0"
                style={{ borderColor: COLORS.blue }}
              />
              {/* Show searching only after 4 seconds */}
              {showSearching && (
                <div className="text-sm text-gray-500 mt-1">Searching...</div>
              )}
            </div>

            {/* Predictions */}
            {predictions.length > 0 && (
              <div className="rounded-lg max-h-60 overflow-y-auto">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectAddress(prediction)}
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <div className="font-semibold text-primary">
                          {prediction.street}
                        </div>
                        <div className="text-sm text-gray-600">
                          {prediction.town}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Map Preview (when address selected) */}
            {selectedAddress && (
              <div className="mt-6 rounded-lg overflow-hidden bg-gray-100 h-48">
                <div ref={mapRef} className="w-full h-full" />
              </div>
            )}
          </div>
        </div>

        {/* Save Button - Always visible at bottom when address selected */}
        {selectedAddress && (
          <div className="p-6 bg-white">
            <button
              onClick={handleSaveAddress}
              disabled={!isValidAddress}
              className="w-full bg-[#0000ff] text-white py-4 rounded-full text-sm font-extrabold italic hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors transform "
            >
              SAVE AND FINISH
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
