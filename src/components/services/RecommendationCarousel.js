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
    const itemWidth = 320; // w-50 = 320px
    const gap = 24; // space-x-6 = 24px
    const totalItems = services.length * 2; // Original + duplicate
    const totalWidth = (itemWidth + gap) * totalItems;

    // Set CSS custom properties for animation
    scrollContainer.style.setProperty("--item-width", `${itemWidth}px`);
    scrollContainer.style.setProperty("--gap-width", `${gap}px`);
    scrollContainer.style.setProperty("--total-width", `${totalWidth}px`);
  }, [services]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8">Our Services</h2>
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-none w-50 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="mt-4">
                <div className="bg-gray-200 h-4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8">Our Services</h2>
        <div className="text-center text-gray-500 py-8">{error.message}</div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary mb-8">Our Services</h2>
        <div className="text-center text-gray-500 py-8">
          No services available at the moment.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={`
            flex space-x-6 pb-4
            animate-infinite-scroll
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {services.map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className="flex-none w-50 cursor-pointer"
            >
              <ServiceCard service={service} />
            </div>
          ))}

          {/* Duplicate for seamless scroll */}
          {services.map((service, index) => (
            <div
              key={`${service.id}-dup-${index}`}
              className="flex-none w-40 h-60 cursor-pointer"
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
            transform: translateX(calc(-344px * ${services.length}));
          }
        }

        @keyframes infinite-scroll-right {
          0% {
            transform: translateX(calc(-344px * ${services.length}));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-infinite-scroll {
          animation: ${shouldFlowLeft
              ? "infinite-scroll-left"
              : "infinite-scroll-right"}
            80s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
