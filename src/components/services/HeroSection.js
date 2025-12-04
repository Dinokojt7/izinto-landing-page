// src/components/services/HeroSection.js
"use client";
import { useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import LoginDialog from "@/app/auth/login/loginDialog";
import AddressSearchDialog from "../maps/AddressSearchDialog";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export default function HeroSection() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const { user, profileComplete } = useAuth();

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

  // Logo opacity transforms
  const lightLogoOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const darkLogoOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  // Avatar filter transformation
  const avatarFilter = useTransform(
    scrollY,
    [0, 100],
    [
      "brightness(0) invert(1)", // White on transparent header
      "brightness(0) invert(0)", // Black on white header
    ],
  );

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

              {/* Logo Container */}
              <div className="flex items-center relative h-8 w-32">
                {/* Light logo for transparent header */}
                <motion.div
                  style={{ opacity: lightLogoOpacity }}
                  className="absolute"
                >
                  <Image
                    src="/images/logo-light.png"
                    alt="Izinto"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                </motion.div>

                {/* Dark logo for white header */}
                <motion.div
                  style={{ opacity: darkLogoOpacity }}
                  className="absolute"
                >
                  <Image
                    src="/images/try-retro.png"
                    alt="Izinto"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                </motion.div>
              </div>
            </div>

            {/* Right: Address Search & User Profile or Login */}
            <div className="flex items-center space-x-3">
              {/* Address Search Button - Fades in on scroll with always white text */}
              <motion.button
                onClick={() => setIsAddressDialogOpen(true)}
                style={{
                  opacity: addressButtonOpacity,
                  scale: addressButtonScale,
                }}
                className="hidden md:flex bg-blue-700 text-white px-3 py-2 rounded-4xl text-sm font-extrabold italic hover:bg-blue-800 transform transition-colors"
              >
                ENTER YOUR ADDRESS
              </motion.button>

              {/* User Profile Link or Login Button */}
              {user ? (
                // User is logged in - show name/surname link to profile
                <Link href="/profile">
                  <motion.button
                    style={{
                      color: headerTextColor,
                      borderColor: headerTextColor,
                    }}
                    className="flex items-center space-x-2 border-2 px-4 py-1 rounded-4xl font-extrabold italic hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <motion.div
                      style={{ filter: avatarFilter }}
                      className="w-5 h-5 relative"
                    >
                      <Image
                        src="/images/user-avatar.png"
                        alt="User"
                        fill
                        className="object-contain"
                        unoptimized // Since it's small icon
                      />
                    </motion.div>
                    <span className="capitalize">
                      {user.displayName ||
                        (profileComplete && user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`.toUpperCase()
                          : "PROFILE")}
                    </span>
                  </motion.button>
                </Link>
              ) : (
                // No user - show login button
                <motion.button
                  onClick={() => setIsLoginDialogOpen(true)}
                  style={{
                    color: headerTextColor,
                    borderColor: headerTextColor,
                  }}
                  className="flex items-center space-x-2 border-2 px-4 py-1 rounded-4xl font-extrabold italic hover:bg-white/20 transition-colors"
                >
                  <motion.div
                    style={{ filter: avatarFilter }}
                    className="w-5 h-5 relative"
                  >
                    <Image
                      src="/images/user-avatar.png"
                      alt="User"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </motion.div>
                  <span>SIGN IN</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Rest of your component remains the same... */}
      {/* Hero Content */}
      <section className="relative h-[80vh] bg-grey-400 overflow-hidden -mt-16 pt-16">
        {/* Background Image - Use next/image for hero background too */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={85}
          />
        </div>

        {/* Overlay */}
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
            className="bg-[#0000ff] text-white px-3 py-2 rounded-4xl text-sm font-extrabold italic hover:bg-blue-800 transition-colors transform"
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
