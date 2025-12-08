// src/components/services/RecommendationCarousel.js
"use client";
import { useEffect, useRef, useState } from "react";
import { useServices } from "@/lib/api/services";
import ServiceCard from "./ServiceCard";

export default function RecommendationCarousel({ isFirstCarousel = true }) {
  const { data: servicesData, isLoading, error } = useServices();
  const scrollContainerRef = useRef(null);
  const shouldFlowLeft = isFirstCarousel !== undefined ? isFirstCarousel : true;
  const services = servicesData?.Specialties || servicesData?.specialties || [];

  // CSS animation for smooth scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || services.length === 0) return;

    // Calculate total width needed for seamless loop
    const itemWidth = 160; // New card width: w-40 = 160px
    const gap = 16; // gap-4 = 16px
    const totalItems = services.length * 2; // Original + duplicate
    const totalWidth = (itemWidth + gap) * totalItems;

    // Set CSS custom properties for animation
    scrollContainer.style.setProperty("--item-width", `${itemWidth}px`);
    scrollContainer.style.setProperty("--gap-width", `${gap}px`);
    scrollContainer.style.setProperty("--total-width", `${totalWidth}px`);
  }, [services]);

  // LOADING STATE - Matches carousel layout
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex gap-4 pb-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-none w-40 animate-pulse">
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-56">
                  <div className="h-44 w-full bg-gray-200"></div>
                  <div className="mt-auto p-2 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ERROR STATE - Matches carousel layout
  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex gap-4 pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-40">
                <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col h-56 border border-gray-300">
                  <div className="h-44 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Error</span>
                  </div>
                  <div className="mt-auto p-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Failed to load
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex gap-4 pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-40">
                <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden flex flex-col h-56 border border-gray-200">
                  <div className="h-44 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No services</span>
                  </div>
                  <div className="mt-auto p-2 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">Empty</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={`
            flex gap-4 pb-4
            animate-infinite-scroll
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Original items */}
          {services.map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className="flex-none w-40" // New width: w-40 (160px)
            >
              <ServiceCard service={service} />
            </div>
          ))}

          {/* Duplicate for seamless scroll */}
          {services.map((service, index) => (
            <div
              key={`${service.id}-dup-${index}`}
              className="flex-none w-40" // Same new width
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              calc(-176px * ${services.length})
            ); /* 160px + 16px gap */
          }
        }

        @keyframes infinite-scroll-right {
          0% {
            transform: translateX(calc(-176px * ${services.length}));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-infinite-scroll {
          animation: ${shouldFlowLeft
              ? "infinite-scroll-left"
              : "infinite-scroll-right"}
            40s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
