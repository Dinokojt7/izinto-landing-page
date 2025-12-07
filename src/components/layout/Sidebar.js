// src/components/layout/Sidebar.js
"use client";
import { useState, useEffect } from "react";
import { useServices } from "@/lib/api/services";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, onClose, showLoginDialog }) {
  const { data: servicesData } = useServices();
  const { user } = useAuth();
  const router = useRouter();
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (servicesData?.Specialties || servicesData?.specialties) {
      const services = servicesData.Specialties || servicesData.specialties;

      // Filter services to only include allowed providers
      const allowedProviders = [
        "Wegas",
        "Easy Laundry",
        "Modern8",
        "Clean Paws",
      ];

      // Group services by provider and filter
      const grouped = services.reduce((acc, service) => {
        const provider = service.provider || "Other";
        if (allowedProviders.includes(provider)) {
          if (!acc[provider]) {
            acc[provider] = [];
          }
          acc[provider].push(service);
        }
        return acc;
      }, {});

      // Convert to array and sort by provider name
      const providersArray = Object.entries(grouped)
        .map(([provider, services]) => ({
          provider,
          serviceCount: services.length,
        }))
        .sort((a, b) => a.provider.localeCompare(b.provider));

      setFilteredProviders(providersArray);
    }
  }, [servicesData]);

  const handleNavigation = (callback) => {
    setIsNavigating(true);
    onClose(); // Close sidebar immediately

    // Small delay to allow sidebar animation
    setTimeout(() => {
      callback();
      // Loading state will be handled by PageLoader component
    }, 100);
  };

  const handleProviderSelect = (provider) => {
    handleNavigation(() => {
      router.push(`/s/${provider.toLowerCase().replace(/\s+/g, "-")}`);
    });
  };

  const handleSignInClick = () => {
    handleNavigation(() => {
      showLoginDialog();
    });
  };

  const handleHelpClick = () => {
    handleNavigation(() => {
      router.push("/help");
    });
  };

  const handleFaqClick = () => {
    handleNavigation(() => {
      router.push("/faqs");
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={handleClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-50 w-full max-w-xs h-full bg-white shadow-2xl overflow-y-auto"
          >
            {/* Header with Logo */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <img
                  src="/images/try-retro.png"
                  alt="Izinto"
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Auth Section - Only show if NO user */}
            {!user && (
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <button
                  onClick={handleSignInClick}
                  className="bg-[#0000ff] text-white px-4 py-2.5 rounded-full text-sm font-extrabold italic hover:bg-blue-900 transition-all w-full text-center"
                >
                  SIGN IN / SIGN UP
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="p-6">
              {/* SELECT SERVICES Header with Icon */}
              <div className="flex items-center gap-3 mb-8">
                {/* Your icon image here - adjust height as needed */}
                <img
                  src="/images/app.png"
                  alt="Services"
                  className="h-5 w-auto"
                />
                <h2 className="text-sm font-black italic tracking-tight text-black">
                  SELECT SERVICES
                </h2>
              </div>

              {/* Filtered Providers List */}
              <div className="space-y-3 mb-10">
                {filteredProviders.map(({ provider, serviceCount }) => (
                  <div
                    key={provider}
                    onClick={() => handleProviderSelect(provider)}
                    className="flex items-center justify-between p-2 rounded hover:bg-blue-50 cursor-pointer transition-colors group hover:border-blue-200"
                  >
                    <div className="flex-1">
                      <div className=" text-black/70 font-semibold hover:text-black text-sm">
                        {provider}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {serviceCount} service{serviceCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Help & Support Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="space-y-4">
                  {/* Help & Support */}
                  <div
                    onClick={handleHelpClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    disabled={isNavigating}
                  >
                    <img
                      src="/images/info.png"
                      alt="Help & Support"
                      className="h-5 w-auto"
                    />
                    <h2 className="text-sm font-black italic tracking-tight text-black">
                      HELP & SUPPORT
                    </h2>
                  </div>

                  {/* FAQs */}
                  <div
                    onClick={handleFaqClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    disabled={isNavigating}
                  >
                    <img
                      src="/images/questions.png"
                      alt="FAQ"
                      className="h-5 w-auto"
                    />
                    <h2 className="text-sm font-black italic tracking-tight text-black">
                      FAQ
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
