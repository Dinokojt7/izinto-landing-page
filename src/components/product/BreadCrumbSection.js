"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import { COLORS } from "@/lib/utils/constants";
import { useServices } from "@/lib/api/services";

export default function BreadcrumbSection({ service }) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const { data: servicesData } = useServices();
  const services = servicesData?.Specialties || servicesData?.specialties || [];

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) {
      setSavedAddress(JSON.parse(saved));
    }

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProviderDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleAddressSave = (addressData) => {
    setSavedAddress(addressData);
    localStorage.setItem("userAddress", JSON.stringify(addressData));
  };

  // Get services by current provider
  const providerServices = services.filter(
    (s) => s.provider === service.provider && s.id !== service.id,
  );

  // Handle service selection from dropdown
  const handleServiceSelect = (selectedService) => {
    const serviceSlug = selectedService.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
    setShowProviderDropdown(false);
  };

  const toggleProviderDropdown = () => {
    setShowProviderDropdown(!showProviderDropdown);
  };

  return (
    <>
      <div className="w-full bg-white border-y border-gray-200 py-3 mt-16">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Top Row - Breadcrumbs & Address */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
            {/* Breadcrumbs - Left Side */}
            <div className="flex items-center flex-wrap gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
              <span className="whitespace-nowrap hover:text-[#0096FF] transition-colors cursor-pointer">
                Home
              </span>
              <span>•</span>

              {/* Provider with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={toggleProviderDropdown}
                >
                  <span className="capitalize whitespace-nowrap text-[#0096FF] font-semibold group-hover:underline">
                    {service.provider}
                  </span>
                  <motion.svg
                    className="w-4 h-4 text-[#0096FF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: showProviderDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>

                {/* MOBILE: Simple Dropdown */}
                <AnimatePresence>
                  {showProviderDropdown &&
                    isMobile &&
                    providerServices.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 xs:w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <h4 className="text-sm font-semibold text-gray-900">
                            More from {service.provider}
                          </h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {providerServices
                            .slice(0, 5)
                            .map((providerService, index) => (
                              <div
                                key={providerService.id}
                                className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                onClick={() =>
                                  handleServiceSelect(providerService)
                                }
                              >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                  {providerService.img ? (
                                    <img
                                      src={
                                        providerService.img.startsWith("http")
                                          ? providerService.img
                                          : `/assets/${providerService.img}`
                                      }
                                      alt={providerService.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextElementSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div className="w-full h-full hidden items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                    {providerService.name.charAt(0)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {providerService.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    R{providerService.price?.[0] || 0}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {providerServices.length > 5 && (
                            <div className="p-3 text-center border-t border-gray-100">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/category/${service.provider.toLowerCase().replace(/\s+/g, "-")}`,
                                  )
                                }
                                className="text-sm text-[#0096FF] font-semibold hover:underline"
                              >
                                View all {providerServices.length} services →
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              <span>•</span>
              <span className="font-semibold text-black whitespace-nowrap truncate max-w-[120px] xs:max-w-none">
                {service.name}
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

          {/* DESKTOP: Full Width Provider Services Row (Only on desktop) */}
          <AnimatePresence>
            {showProviderDropdown &&
              !isMobile &&
              providerServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200">
                    {/* Services Grid - Desktop Only */}
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {providerServices.slice(0, 6).map((providerService) => (
                        <div
                          key={providerService.id}
                          className="flex flex-col items-center cursor-pointer group"
                          onClick={() => handleServiceSelect(providerService)}
                        >
                          <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-full overflow-hidden bg-gray-100 mb-2 group-hover:ring-2 ring-[#0096FF] transition-all duration-300">
                            {providerService.img ? (
                              <img
                                src={
                                  providerService.img.startsWith("http")
                                    ? providerService.img
                                    : `/assets/${providerService.img}`
                                }
                                alt={providerService.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full hidden items-center justify-center bg-gray-200 text-gray-500 text-sm font-semibold">
                              {providerService.name.charAt(0)}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-900 truncate max-w-full group-hover:text-[#0096FF] transition-colors">
                              {providerService.name.length > 20
                                ? `${providerService.name.substring(0, 20)}...`
                                : providerService.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              R{providerService.price?.[0] || 0}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Link (if more than 6 services) */}
                    {providerServices.length > 6 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() =>
                            router.push(
                              `/category/${service.provider.toLowerCase().replace(/\s+/g, "-")}`,
                            )
                          }
                          className="text-sm text-[#0096FF] font-semibold hover:underline"
                        >
                          View all {providerServices.length} services →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
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
