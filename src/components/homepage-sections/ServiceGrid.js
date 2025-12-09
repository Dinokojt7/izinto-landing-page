// src/components/services/ServiceGrid.js
"use client";
import { useAllServices } from "@/lib/api/services";
import RecommendationCarousel from "./RecommendationCarousel";

export default function ServiceGrid({ shouldFlowLeft = true }) {
  const { data: servicesData, isLoading, error } = useAllServices();

  const services = servicesData?.Specialties || [];

  if (isLoading || error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex gap-4 pb-4">
            {/* Create shimmer cards matching the carousel layout */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-none w-40 animate-pulse">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-56">
                  {/* Image area shimmer */}
                  <div className="h-44 w-full bg-gray-200"></div>

                  {/* Text area shimmer */}
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

  return (
    <>
      <RecommendationCarousel isFirstCarousel={shouldFlowLeft} />
    </>
  );
}
