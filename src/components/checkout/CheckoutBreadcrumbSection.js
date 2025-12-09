"use client";
import { useState } from "react";
import Link from "next/link";
import { COLORS } from "@/lib/utils/constants";
import { useAddress } from "@/providers/AddressProvider";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import AddressSelectionDialog from "@/components/maps/AddressSelectionDialog";

export default function CheckoutBreadcrumbSection() {
  const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  // Use AddressProvider hook
  const {
    activeAddress: savedAddress,
    hasAddresses,
    saveAddress,
  } = useAddress();

  const handleAddressSave = (addressData) => {
    saveAddress(addressData);
    setIsAddressDialogOpen(false);
  };

  const handleAddressButtonClick = () => {
    if (hasAddresses) {
      setIsAddressSelectionOpen(true);
    } else {
      setIsAddressDialogOpen(true);
    }
  };

  return (
    <>
      <div className="w-full bg-white border-y border-gray-200 py-4 md:py-3 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Column layout with spacing */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Breadcrumbs - Top on mobile */}
            <div className="flex items-center flex-wrap gap-1 xs:gap-2 text-sm xs:text-sm text-gray-600 justify-center md:justify-start">
              <Link
                href="/services"
                className="whitespace-nowrap hover:text-[#0096FF] transition-colors cursor-pointer"
              >
                Home
              </Link>
              <span>•</span>
              <Link
                href="/cart"
                className="whitespace-nowrap hover:text-[#0096FF] transition-colors cursor-pointer"
              >
                Cart
              </Link>
              <span>•</span>
              <span className="font-semibold text-black whitespace-nowrap">
                Checkout
              </span>
            </div>

            {/* Right Side - Bottom on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-3 sm:gap-4">
              {/* Available Flag */}
              {savedAddress && (
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  <div
                    className="px-3 py-1.5 rounded-full font-extrabold italic text-sm sm:text-sm shrink-0"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    <span className="text-gray-600">Available</span>
                  </div>
                  <span className="text-gray-600 font-extrabold italic text-lg hidden sm:inline">
                    ·
                  </span>
                </div>
              )}

              {/* Address Button */}
              {savedAddress ? (
                <button
                  onClick={handleAddressButtonClick}
                  className="flex items-center justify-center gap-2 text-primary font-semibold hover:text-gray-700 transition-colors min-w-0 w-full sm:w-auto"
                >
                  <span className="text-base sm:text-base text-black font-extrabold italic truncate max-w-[180px] sm:max-w-[200px] lg:max-w-none">
                    {savedAddress.street}
                  </span>
                  <svg
                    className="w-5 h-5 shrink-0"
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
                  onClick={handleAddressButtonClick}
                  className="text-[#0000ff] px-4 sm:px-6 py-2 sm:py-2 rounded-full text-base sm:text-sm font-extrabold italic transition-all transform whitespace-nowrap hover:bg-blue-100 bg-blue-50 active:scale-95 shrink-0 w-full sm:w-auto text-center"
                >
                  ADD ADDRESS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Dialog */}
      <AddressSelectionDialog
        isOpen={isAddressSelectionOpen}
        onClose={() => setIsAddressSelectionOpen(false)}
        showAddressSearchDialog={() => setIsAddressDialogOpen(true)}
      />

      {/* Address Search Dialog (for adding new addresses) */}
      <AddressSearchDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressSave={handleAddressSave}
      />
    </>
  );
}
