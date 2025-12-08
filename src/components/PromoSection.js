// src/components/promo/PromoSection.js
"use client";
import { useRef, useState, useEffect } from "react";
import { useServices } from "@/lib/api/services";
import { useAuth } from "@/lib/context/AuthContext";
import MainServiceCard from "./ui/MainServiceCard";
import CircularProgressIndicator from "./ui/CircularProgessIndicator";
import PromoDialog from "./promo/PromoDialog";
import LoginSnackbar from "./promo/LoginSnackbar";
import LoginDialog from "@/app/auth/login/loginDialog";

import { Inter, Poppins, Roboto } from "next/font/google";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function PromoSection() {
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoginSnackbar, setShowLoginSnackbar] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const { data: servicesData, isLoading, error } = useServices();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const { user } = useAuth();

  const services = servicesData?.Specialties || servicesData?.specialties || [];

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < services.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToIndex(currentIndex + 1);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 256;
      const gap = 24;
      const scrollPosition = index * (cardWidth + gap);

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const handleLearnMoreClick = () => {
    if (!user) {
      setShowLoginSnackbar(true);
    } else {
      setShowPromoDialog(true);
    }
  };

  const handleSnackbarLogin = () => {
    setShowLoginSnackbar(false);
    setIsLoginDialogOpen(true);
  };

  const handleViewMore = () => {
    router.push(`/services`);
  };

  return (
    <section
      className={`max-w-7xl mx-auto py-12 mb-10 px-4 sm:px-6 lg:px-8 text-center bg-[#0096FF] ${poppins.className}`}
    >
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-96">
        {/* Image Container */}
        <div className="w-full h-64 lg:h-96 bg-gray-300 rounded-2xl overflow-hidden order-2 lg:order-3">
          <img
            src="/images/onboard_wash.jpg"
            alt="Referral Program"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content Container */}
        <div className="w-full flex flex-col justify-center items-start text-left order-1">
          <h2 className="text-4xl lg:text-6xl font-black italic text-black mb-4 lg:mb-6 leading-tight">
            EARN WITH OUR
            <br />
            REFERRAL PROGRAM
          </h2>
          <p className="text-base lg:text-base text-black mb-6 max-w-lg">
            Your friend gets R50 off their first service booking when they spend
            R500 or more.
          </p>

          {/* Updated Button with Auth Check */}
          <button
            onClick={handleLearnMoreClick}
            className="bg-[#0000ff] text-white px-6 sm:px-8 py-3 lg:py-4 rounded-full text-sm lg:text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap w-full lg:w-auto text-center"
          >
            LEARN MORE & EARN
          </button>
        </div>
      </div>

      {/* Services Carousel Section */}
      <div className="mt-12 lg:mt-20 w-full">
        {/* Header - Responsive */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 lg:mb-2 gap-4 lg:gap-0">
          <h3 className="text-xl lg:text-2xl font-black italic text-black leading-tight lg:leading-normal text-left">
            BROWSE AND BOOK YOUR FAVOURITE SERVICES.
          </h3>
          <button
            onClick={() => handleViewMore()}
            className="flex text-black text-sm font-black hover:underline cursor-pointer hover:text-gray-900 transition-colors self-start lg:self-auto"
          >
            MORE ITEMS
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow - Hidden on mobile */}
          {services.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                disabled={currentIndex === services.length - 1}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-30"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Right Arrow - Hidden on mobile */}
              <button
                onClick={scrollRight}
                disabled={currentIndex === services.length - 1}
                className=" absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-30"
              >
                <svg
                  className="w-6 h-6 text-white"
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
              </button>
            </>
          )}

          {/* Services Grid - Edge to edge on mobile */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide px-0 lg:px-2 snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {services.map((service, index) => (
              <MainServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
      <LoginSnackbar
        isOpen={showLoginSnackbar}
        onClose={() => setShowLoginSnackbar(false)}
        onLogin={handleSnackbarLogin}
      />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      {/* Promo Dialog for logged in users */}
      <PromoDialog
        isOpen={showPromoDialog}
        onClose={() => setShowPromoDialog(false)}
      />
    </section>
  );
}
