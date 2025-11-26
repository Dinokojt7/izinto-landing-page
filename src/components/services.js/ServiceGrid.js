// src/components/services/ServiceGrid.js
"use client";
import { useAllServices } from "@/lib/api/services";
import RecommendationCarousel from "./RecommendationCarousel";

export default function ServiceGrid({shouldFlowLeft=true}) {
  const { data: servicesData, isLoading, error } = useAllServices();

  const services = servicesData?.Specialties || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="mt-4">
                <div className="bg-gray-200 h-4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-600">
          Failed to load services. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <RecommendationCarousel isFirstCarousel={shouldFlowLeft} />
      
    
    </>
  );
}