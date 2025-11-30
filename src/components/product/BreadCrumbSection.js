"use client";
import { useState, useEffect } from "react";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import { COLORS } from "@/lib/utils/constants";

export default function BreadcrumbSection({ service }) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) {
      setSavedAddress(JSON.parse(saved));
    }
  }, []);

  const handleAddressSave = (addressData) => {
    setSavedAddress(addressData);
    localStorage.setItem("userAddress", JSON.stringify(addressData));
  };

  return (
    <>
      <div className="w-full bg-white border-y border-gray-200 py-3 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Home</span>
              <span>•</span>
              <span className="capitalize">{service.provider}</span>
              <span>•</span>
              <span className="font-semibold text-black">{service.name}</span>
            </div>

            {/* Address Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <div
                  className="px-4 py-2 rounded-full font-extrabold italic"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <span className="text-gray-600">Available</span>
                </div>
                <span className="text-gray-600 font-extrabold italic text-lg">
                  ·
                </span>
              </div>

              {savedAddress ? (
                <button
                  onClick={() => setIsAddressDialogOpen(true)}
                  className="flex items-center space-x-2 text-primary font-semibold hover:text-gray-700 transition-colors"
                >
                  <span className="text-lg text-black font-extrabold italic">
                    {savedAddress.street}
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsAddressDialogOpen(true)}
                  className="bg-[#0000ff] text-white px-6 py-2 rounded-full text-sm font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
                >
                  ADD ADDRESS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddressSearchDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressSave={handleAddressSave}
      />
    </>
  );
}
