"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import { COLORS } from "@/lib/utils/constants";

export default function HomeBreadcrumbSection() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const router = useRouter();

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
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Breadcrumbs - Left Side */}
            <div className="flex items-center flex-wrap gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
              <span className="font-semibold text-black whitespace-nowrap">
                All Services
              </span>
            </div>

            {/* Right Side - Available Flag + Address */}
            <div className="flex items-center justify-between sm:justify-end gap-2 xs:gap-3">
              {/* Available Flag */}
              {savedAddress && (
                <>
                  <div
                    className="px-2 xs:px-3 py-1 xs:py-1.5 rounded-full font-extrabold italic text-xs xs:text-sm shrink-0"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    <span className="text-gray-600">Available</span>
                  </div>
                  <span className="text-gray-600 font-extrabold italic text-base xs:text-lg hidden sm:inline">
                    ·
                  </span>
                </>
              )}

              {/* Address Button */}
              {savedAddress ? (
                <button
                  onClick={() => setIsAddressDialogOpen(true)}
                  className="flex items-center gap-1 xs:gap-2 text-primary font-semibold hover:text-gray-700 transition-colors min-w-0"
                >
                  <span className="text-sm xs:text-base text-black font-extrabold italic truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[180px] lg:max-w-none">
                    {savedAddress.street}
                  </span>
                  <svg
                    className="w-4 h-4 xs:w-5 xs:h-5 shrink-0"
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
                  className="text-[#0000ff] px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-extrabold italic transition-all transform whitespace-nowrap hover:bg-blue-50 active:scale-95 shrink-0"
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
