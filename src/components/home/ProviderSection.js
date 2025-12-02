"use client";
import { useRef, useState } from "react";
import { getProviderExplanation } from "@/lib/utils/providerExplanations";
import MainServiceCard from "../ui/MainServiceCard";

export default function ProviderSection({
  provider,
  services,
  index,
  onServiceSelect,
  onProviderSelect,
}) {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const providerExplanation = getProviderExplanation(provider);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
      setCurrentIndex(Math.min(services.length - 1, currentIndex + 1));
    }
  };

  if (!services || services.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Provider Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-black italic text-black">
          {provider}
        </h1>

        <button
          onClick={() => onProviderSelect(provider)}
          className="flex items-center text-black text-sm font-black hover:underline cursor-pointer hover:text-gray-900 transition-colors"
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

      {/* Services Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        {services.length > 4 && (
          <>
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
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

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              disabled={currentIndex === services.length - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-30"
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

        {/* Services Grid */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-0 lg:px-2 snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {services.map((service) => (
            <div key={service.id} className="flex-none w-42 snap-start">
              <MainServiceCard
                service={service}
                onClick={() => onServiceSelect(service)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* View All Button (Mobile) */}
      <div className="sm:hidden text-center pt-4">
        <button
          onClick={() => onProviderSelect(provider)}
          className="flex items-center text-black text-sm font-black hover:underline cursor-pointer hover:text-gray-900 transition-colors"
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
    </section>
  );
}
