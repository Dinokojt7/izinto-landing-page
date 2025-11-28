// src/components/services/HeroSection.js
"use client";
import { useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import LoginDialog from "@/app/auth/login/loginDialog";
import AddressSearchDialog from "../maps/AddressSearchDialog";
import { COLORS } from "@/lib/utils/constants";

export default function HeroSection() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  const { scrollY } = useScroll();

  // Transform values for animations
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
  );
  const headerTextColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255,255,255)", "rgb(18,18,18)"],
  );
  const headerBorderColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(229,231,235,1)"],
  );
  const addressButtonOpacity = useTransform(scrollY, [0, 50, 100], [0, 0.5, 1]);
  const addressButtonScale = useTransform(scrollY, [0, 100], [0.8, 1]);

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) {
      setSavedAddress(JSON.parse(saved));
    }
  }, []);

  const handleAddressSave = (addressData) => {
    setSavedAddress(addressData);
  };
  return (
    <>
      {/* Header - Fixed at top, transparent initially */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b"
        style={{
          background: headerBackground,
          borderColor: headerBorderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left: Hamburger Menu & Logo */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setIsSidebarOpen(true)}
                style={{ color: headerTextColor }}
                className="p-2 pt-3 rounded-lg hover:bg-white/20 transition-colors"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </motion.button>

              {/* Image Logo with light/dark variants */}
              <motion.div className="flex items-center">
                {/* Light logo for transparent header */}
                <motion.img
                  src="/images/logo-light.png"
                  alt="Izinto"
                  style={{ opacity: useTransform(scrollY, [0, 100], [1, 0]) }}
                  className="h-8 w-auto absolute"
                />
                {/* Dark logo for white header */}
                <motion.img
                  src="/images/try-retro.png"
                  alt="Izinto"
                  style={{ opacity: useTransform(scrollY, [0, 100], [0, 1]) }}
                  className="h-8 w-auto"
                />
              </motion.div>
            </div>

            {/* Right: Address Search & Login - Always visible */}
            <div className="flex items-center space-x-3">
              {/* Address Search Button - Fades in on scroll with always white text */}
              <motion.button
                onClick={() => setIsAddressDialogOpen(true)}
                style={{
                  opacity: addressButtonOpacity,
                  scale: addressButtonScale,
                }}
                className="hidden md:flex bg-blue-700 text-white px-3 py-2 rounded-4xl text-sm font-extrabold italic hover:bg-blue-800  transform  transition-colors"
              >
                ENTER YOUR ADDRESS
              </motion.button>

              {/* Login Button - Always visible */}
              <motion.button
                onClick={() => setIsLoginDialogOpen(true)}
                style={{
                  color: headerTextColor,
                  borderColor: headerTextColor,
                }}
                className="flex items-center space-x-2 border-2 px-4 py-1 rounded-4xl font-extrabold italic hover:bg-white/20 transition-colors"
              >
                <motion.img
                  src="/images/user-avatar.png"
                  alt="User"
                  style={{
                    filter: useTransform(
                      scrollY,
                      [0, 100],
                      [
                        "brightness(0) invert(1)", // White on transparent header
                        "brightness(0) invert(0)", // Black on white header
                      ],
                    ),
                  }}
                  className="w-5 h-5"
                />
                <span>SIGN IN</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Content - Starts from top of viewport */}
      <section className="relative h-[80vh] bg-grey-400 overflow-hidden -mt-16 pt-16">
        {/* Background Image - Covers entire section including behind header */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/hero.jpg)",
          }}
        />

        {/* Overlay - Covers entire section including behind header */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content - Centered in the hero area (excluding header) */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          {/* Main Text */}
          <h1 className="text-5xl md:text-7xl font-extrabold italic mb-8 max-w-4xl leading-tight">
            THE FUTURE OF HOME-CARE IS INSTANT.
          </h1>

          {/* Address Search Button - Center (only in hero) */}
          <motion.button
            onClick={() => setIsAddressDialogOpen(true)}
            style={{
              opacity: useTransform(scrollY, [0, 100], [1, 0]),
              scale: useTransform(scrollY, [0, 100], [1, 0.8]),
            }}
            className="bg-blue-700 text-white px-3 py-2 rounded-4xl text-sm font-extrabold italic hover:bg-blue-800 transition-colors transform"
          >
            ENTER YOUR ADDRESS
          </motion.button>
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-colors">
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
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* {savedAddress && (
        <div className="w-full bg-white border-y border-gray-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end space-x-3">
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
            </div>
          </div>
        </div>
      )} */}

      {/* Dialogs */}
      <AddressSearchDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressSave={handleAddressSave}
      />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
