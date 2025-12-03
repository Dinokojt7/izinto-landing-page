"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/lib/api/services";
import Link from "next/link";

export default function BottomBreadcrumbSection({ service }) {
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const { data: servicesData } = useServices();
  const services = servicesData?.Specialties || servicesData?.specialties || [];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

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

  // Get services by current provider
  const providerServices = services.filter(
    (s) => s.provider === service.provider && s.id !== service.id,
  );

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
      <div className="w-full bg-white py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs - Clean Version */}
          <div className="flex items-center flex-wrap gap-2 xs:gap-3 text-sm">
            <Link
              href="/services"
              className="text-black underline transition-colors"
            >
              Home
            </Link>

            <span className="text-gray-400">/</span>

            {/* Provider with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={toggleProviderDropdown}
              >
                <span className="text-black underline transition-colors">
                  {service.provider}
                </span>
              </div>

              {/* Mobile Dropdown */}
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
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
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

            <span className="text-gray-400">/</span>
            <span className="font-medium text-black">{service.name}</span>
          </div>

          {/* Desktop Provider Services Row */}
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
                  <div className="pt-6 border-t border-gray-100 mt-4">
                    {/* Services Grid */}
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                      {providerServices.slice(0, 6).map((providerService) => (
                        <div
                          key={providerService.id}
                          className="flex flex-col items-center cursor-pointer group"
                          onClick={() => handleServiceSelect(providerService)}
                        >
                          <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-full overflow-hidden bg-gray-100 mb-3 group-hover:ring-2 ring-[#0096FF] transition-all duration-300">
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
                            <p className="text-xs font-medium text-gray-900 truncate max-w-full group- transition-colors">
                              {providerService.name.length > 20
                                ? `${providerService.name.substring(0, 20)}...`
                                : providerService.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              R{providerService.price?.[0] || 0}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View All Link */}
                    {providerServices.length > 6 && (
                      <div className="text-center mt-6">
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
    </>
  );
}
