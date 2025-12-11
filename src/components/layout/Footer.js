"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useAuth } from "@/lib/context/AuthContext";
import { useOtp } from "@/lib/context/OtpContext"; // Import the new OTP context

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function Footer() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [localError, setLocalError] = useState(""); // Local UI errors only

  const { user, loading } = useAuth();
  const { triggerOtpFromAnywhere, isLoading } = useOtp(); // Get from global OTP context

  const validateAndFormatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");

    // South African numbers: 10 digits (e.g., 0821234567)
    const isSouthAfrican = cleaned.startsWith("0") && cleaned.length === 10;

    if (isSouthAfrican) {
      const subscriberNumber = cleaned.substring(1);
      return `+27${subscriberNumber}`;
    }

    const hasCountryCode =
      cleaned.startsWith("27") || cleaned.startsWith("+27");
    if (hasCountryCode && cleaned.length >= 11) {
      return `+${cleaned.replace("+", "")}`;
    }

    return null;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setLocalError(""); // Clear error when user types

    // Check if valid South African format (10 digits starting with 0)
    const isValid = value.startsWith("0") && value.length === 10;
    setIsValidPhone(isValid);
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      setLocalError("Enter your mobile number");
      return;
    }

    if (!isValidPhone) {
      setLocalError("Enter a valid SA number (e.g., 0821234567)");
      return;
    }

    setLocalError(""); // Clear any previous errors

    // 🔧 Use the global OTP trigger instead of local logic
    const result = await triggerOtpFromAnywhere(phoneNumber);

    if (!result.success) {
      setLocalError(result.error || "Failed to send OTP");
    }
  };

  const socialIcons = [
    {
      name: "instagram",
      svg: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="#000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
        </svg>
      ),
      url: "https://www.instagram.com/izinto_za/",
    },
    {
      name: "x",
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="#000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.9 2H22l-8.2 9.1L23 22h-5.6l-5.8-7.6L6 22H2l8.6-9.5L2 2h5.8l5.3 7.1L18.9 2zm-1.4 17.3h2.3L7.3 4.2H4.8l12.7 15.1z" />
        </svg>
      ),
      url: "https://x.com/izinto_za",
    },
    {
      name: "tiktok",
      svg: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="#000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.6 5.82s.03.46.13.9c.12.4.32.77.6 1.08.28.3.63.53 1.02.66.42.15.86.18 1.3.12.02 0 .04.01.06.01v2.79a4.3 4.3 0 01-2.27-.63 4.44 4.44 0 01-1.62-1.66v6.45a6.45 6.45 0 11-6.45-6.45h.03v2.21a4.22 4.22 0 103.74 4.15l.03-10.84h2.2a4.9 4.9 0 002.13 3.62v-2.4z" />
        </svg>
      ),
      url: "https://www.tiktok.com/@izintoza_",
    },
    {
      name: "youtube",
      svg: (
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000"
        >
          <path d="M23.498 6.186a2.986 2.986 0 0 0-2.103-2.103C19.479 3.5 12 3.5 12 3.5s-7.479 0-9.395.583a2.986 2.986 0 0 0-2.103 2.103C0.919 8.102 0.919 12 0.919 12s0 3.898.583 5.814a2.986 2.986 0 0 0 2.103 2.103C4.521 20.5 12 20.5 12 20.5s7.479 0 9.395-.583a2.986 2.986 0 0 0 2.103-2.103C24.081 15.898 24.081 12 24.081 12s0-3.898-.583-5.814zM9.75 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      ),
      url: "https://www.youtube.com/@izinto_za",
    },
  ];

  const footerLinks = {
    helpSupport: [
      { name: "More for Less", href: "/" },
      { name: "Contact Us", href: "/help" },
    ],
    workWithUs: [
      {
        name: "Partner and Affiliate Requests",
        href: "/c/affiliates-and-partnerships",
      },
    ],
    company: [
      { name: "FAQs", href: "/faqs" },
      { name: "Blog", href: "/blog" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/policy/privacy-policy" },
      { name: "Terms of Use", href: "/policy/terms-of-use" },
    ],
    appStores: [
      {
        name: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.izinto.dev",
        image: "/images/google-button.png",
      },
      {
        name: "App Store",
        href: "https://apps.apple.com/app/izinto",
        image: "/images/apple-button.png",
      },
    ],
  };

  const areas = [
    "Fourways",
    "North Riding",
    "Midrand",
    "Waterfall",
    "Lonehill",
    "Rivonia",
    "Woodmead",
    "Sandton",
    "Alexandra",
    "Lethabong",
    "Rosebank",
    "Houghton",
    "Cresta",
    "Randburg",
    "Parktown",
    "Braamfontein",
    "Auckland Park",
    "Melville",
    "Joburg CBD",
    "Edenvale",
    "East Gate",
    "Linksfield",
    "Orange Grove",
    "Johannesburg North",
    "Johannesburg South",
  ];

  if (loading) {
    return null;
  }

  return (
    <footer className={`bg-gray-50 pt-16 pb-8 ${poppins.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.img
          src="/images/try-retro.png"
          alt="Izinto"
          className="h-8 items-start"
        />
        {/* Tagline */}
        <h2 className="text-gray-500 mt-4 text-sm">
          Everyday value in your pocket in as fast as 45 minutes.
        </h2>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-8" />

        {/* Call to Action - Only show if user is NOT logged in */}
        {!user && (
          <>
            <h2 className="text-black mt-4 text-base italic font-black uppercase tracking-tight">
              LET'S GET MOVING. DROP YOUR MOBILE NUMBER TO START YOUR BOOKING OR
              PICK UP WHERE YOU LEFT OFF.
            </h2>

            <div className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 mt-6">
              {/* Phone Input Section - YOUR BEAUTIFUL UI KEPT INTACT */}
              <div className="flex flex-col sm:flex-row gap-3 px-1 w-full sm:flex-1 sm:max-w-sm">
                {/* Country Code with Flag - YOUR EXACT UI */}
                <div className="w-full sm:w-24 p-3 border border-gray-300 text-black rounded-lg bg-gray-50 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                  <img
                    src="/flags/za-flag.png"
                    alt="ZA"
                    className="w-5 h-4 rounded-sm"
                  />
                  <span>+27</span>
                </div>

                {/* Phone Input - YOUR EXACT UI WITH ERROR BORDERS */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Mobile number"
                  maxLength={10}
                  className={`flex-1 p-3 rounded-lg focus:outline-none sm:text-center sm:justify-center focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all text-base border ${
                    localError ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Submit Button - YOUR EXACT UI */}
              <button
                onClick={handleSubmit}
                disabled={!isValidPhone || isLoading}
                className="bg-[#0000ff] text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-extrabold italic hover:bg-blue-900 transition-all transform whitespace-nowrap w-full sm:w-auto text-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "SIGN IN / SIGN UP"
                )}
              </button>
            </div>

            {/* Error Message - YOUR EXACT UI */}
            {localError && (
              <p className="text-red-500 text-xs mt-2">{localError}</p>
            )}
          </>
        )}

        {/* Four Column Section - FLEX LAYOUT */}
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {/* Section 1: HELP & SUPPORT */}
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight italic text-black mb-4">
              HELP & SUPPORT.
            </h2>
            <div className="space-y-2">
              {footerLinks.helpSupport.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-black text-sm font-semibold underline cursor-pointer transition-colors block"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 2: WORK WITH US */}
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight italic text-black mb-4">
              WORK WITH US.
            </h2>
            <div className="space-y-2">
              {footerLinks.workWithUs.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-black text-sm font-semibold underline cursor-pointer transition-colors block"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: COMPANY */}
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight italic text-black mb-4">
              COMPANY.
            </h2>
            <div className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-black text-sm font-semibold underline cursor-pointer transition-colors block"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: APP STORES - With Permanent Flags */}
          <div className="flex-1 md:flex-2">
            <div className="flex space-x-2 w-full">
              {footerLinks.appStores.map((store, index) => (
                <div key={index} className="flex-1 relative">
                  {/* Image Container with Overlay */}
                  <div className="relative w-full h-14">
                    {/* Original Image */}
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-14 object-contain rounded-lg"
                    />

                    {/* Light Gray Overlay - Dims the image */}
                    <div className="absolute inset-0 bg-gray-100/30 rounded-lg" />

                    {/* Permanent Flag Badge - Top Right */}
                    <div className="absolute -top-3.5 -right-1.5 z-10">
                      <div
                        className="bg-white border border-gray-100 text-black 
              px-1.5 py-0.1 rounded-md  min-w-[60px]"
                      >
                        <span className="text-[9px] font-semibold uppercase tracking-wide">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Areas Text */}
        <div className="mt-12">
          <h2 className="text-gray-500 text-sm font-normal leading-relaxed">
            Izinto provide comprehensive laundry, home care, and gas services
            across all listed areas. Our radius covers major suburbs in
            Johannesburg North and surrounding regions. Service availability may
            vary based on specific location within each area.{" "}
            <span className="underline font-medium">{areas.join(" , ")}</span>
          </h2>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-base italic font-extrabold text-black/30 mb-4 md:mb-0">
            © 2025 IZINTO TECHNOLOGIES
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="text-gray-500 text-xs font-normal underline cursor-pointer transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {socialIcons.map((icon, i) => (
              <a
                key={i}
                href={icon.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:opacity-75 transition-opacity ${i === 1 ? "pt-1" : i === 2 ? "pt-1" : ""}`}
                aria-label={`Follow us on ${icon.name}`}
              >
                {icon.svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
