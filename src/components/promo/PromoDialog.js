"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function PromoDialog({ isOpen, onClose }) {
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Also handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserPromoInfo();
    }
  }, [user, isOpen]);

  const fetchUserPromoInfo = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await getUserPromoInfo(user.uid);
      if (result.success) {
        setPromoCode(result.promoCode || "No code");
        setReferralStats({
          credits: result.referralCredits,
          earnings: result.referralEarnings,
          total: result.totalReferrals,
        });
      }
    } catch (error) {
      console.error("Error fetching promo info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!promoCode || promoCode === "Generating...") return;

    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Get R50 off your first Izinto service!",
        text: `Use my promo code ${promoCode} to get R50 off your first service booking on Izinto! 🏠✨`,
        url: window.location.origin,
      });
    } else {
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 overflow-y-auto">
      <div className="bg-white rounded-xl w-[calc(100vw-2rem)] sm:w-11/12 max-w-md max-h-[calc(100vh-4rem)] sm:max-h-[90vh] overflow-hidden flex flex-col mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="/images/try-retro.png"
              alt="Izinto"
              className="h-8 w-auto"
            />
            <span className="text-sm font-black text-[#0096FF]">REFERRAL</span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-800 hover:text-black p-2 transition-colors"
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
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="promo-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero Section */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#0096FF]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#0096FF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-black italic text-black mb-2">
                  EARN WITH OUR
                  <br />
                  REFERRAL PROGRAM
                </h2>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#0096FF] rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">
                      You Earn R50 Credit
                    </h3>
                    <p className="text-sm text-gray-600">
                      When your friend completes their first booking using your
                      code, you'll receive R50 service credit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#0096FF] rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">
                      They Save R50 Instantly
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your friend gets R50 off their first service order when
                      they spend R500 or more.
                    </p>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="mb-6">
                <h3 className="font-bold text-black mb-4 text-center">
                  Simple Steps to Earn Together
                </h3>
                <div className="space-y-3">
                  {[
                    "Share your unique promo code with friends & family",
                    "They enter your code when booking their first service",
                    "Their order must be R500+ to qualify for the R50 discount",
                    "Once completed, you receive R50 service credit within 24 hours",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#0096FF] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-bold text-black mb-2 text-center">
                  Your Unique Referral Code
                </h3>

                {isLoading ? (
                  <div className="h-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0096FF]"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-center font-bold text-xl text-[#0096FF] tracking-wider">
                          {promoCode}
                        </p>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-3 bg-[#0096FF] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <p className="text-sm text-center text-gray-600">
                      Share this code with friends & family to get R50 on your
                      next order!
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Share with Friends
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-black transition-colors text-sm"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
