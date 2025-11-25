// src/components/maps/AddressSearchDialog.js
"use client";
import { useState, useEffect } from "react";
import { COLORS } from "@/lib/utils/constants";

export default function AddressSearchDialog({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock address validation (replace with actual Google Places API)
  const validateAddress = async (lat, lng) => {
    try {
      // Reference coordinates (Sandton, Johannesburg)
      const refLat = -26.056;
      const refLng = 28.06;

      const distance = calculateDistance(lat, lng, refLat, refLng);
      return distance <= 20; // 20km radius
    } catch (error) {
      console.error("Error validating address:", error);
      return false;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
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
      return;
    }

    setIsLoading(true);
    // Mock predictions - replace with actual Google Places Autocomplete
    const mockPredictions = [
      {
        id: 1,
        street: "123 Main Street",
        town: "Sandton, Johannesburg",
      },
      {
        id: 2,
        street: "456 Oak Avenue",
        town: "Sandton, Johannesburg",
      },
      {
        id: 3,
        street: "789 Pine Road",
        town: "Randburg, Johannesburg",
      },
    ];

    setPredictions(mockPredictions);
    setIsLoading(false);
  };

  const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    setSearchQuery(`${address.street}, ${address.town}`);
    setPredictions([]);

    // Mock coordinates - replace with actual geocoding
    const mockCoords = { lat: -26.056, lng: 28.06 };

    const isValid = await validateAddress(mockCoords.lat, mockCoords.lng);
    setIsValidAddress(isValid);
    setStatusText(
      isValid
        ? "😎 Yay we're available in your area!"
        : "💔 Oops! we're not available in this area!",
    );
  };

  const handleSaveAddress = () => {
    if (selectedAddress) {
      localStorage.setItem(
        "userAddress",
        JSON.stringify({
          ...selectedAddress,
          isValid: isValidAddress,
        }),
      );
      onClose();
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden">
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

        {/* Content */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=""
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-0"
              style={{ borderColor: COLORS.blue }}
            />
          </div>

          {/* Predictions */}
          {predictions.length > 0 && (
            <div className=" rounded-lg max-h-60 overflow-y-auto">
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
            <div className="mt-6 p-4 border rounded-lg bg-gray-100 h-48 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-cartBlue"
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
                <p className="font-semibold">Map Preview</p>
                <p className="text-sm">Selected: {selectedAddress.street}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          {selectedAddress && (
            <button
              onClick={handleSaveAddress}
              disabled={!isValidAddress}
              className="w-full mt-6 bg-cartBlue text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              SAVE SELECTION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
