// app/s/[provider]/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useServices } from "@/lib/api/services";
import { getProviderExplanation } from "@/lib/utils/providerExplanations";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import CategoryBreadcrumbSection from "./ProviderBreadcrumbSection";
import MainServiceCard from "@/components/ui/MainServiceCard";
import ProductHeader from "@/components/product/ProductHeader";
import HowWeWork from "@/components/services/HowWeWork";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function ProviderCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { data: servicesData, isLoading } = useServices();
  const scrollContainerRef = useRef(null);
  const [providerServices, setProviderServices] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    if (servicesData?.Specialties || servicesData?.specialties) {
      const services = servicesData.Specialties || servicesData.specialties;
      const providerSlug = params.provider;

      // Find provider name from slug
      const providers = [...new Set(services.map((s) => s.provider))];
      const foundProvider = providers.find(
        (p) => p.toLowerCase().replace(/\s+/g, "-") === providerSlug,
      );

      if (foundProvider) {
        setProviderName(foundProvider);
        // Get all services for this provider
        const providerServices = services.filter(
          (s) => s.provider === foundProvider,
        );
        setProviderServices(providerServices);

        // Create a mock service object for HowWeWork component
        if (providerServices.length > 0) {
          setCurrentService({
            provider: foundProvider,
            name: `${foundProvider} Services`,
          });
        }
      }
    }
  }, [servicesData, params.provider]);

  // Horizontal scroll functions for mobile
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 180;
      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 180;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleServiceSelect = (service) => {
    const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
  };

  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (!providerName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Provider not found</p>
        <Link href="/services" className="text-[#0096FF] hover:underline">
          ← Back to all services
        </Link>
      </div>
    );
  }

  const providerExplanation = getProviderExplanation(providerName);

  return (
    <div className="min-h-screen bg-white">
      <ProductHeader />
      <CategoryBreadcrumbSection provider={providerName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Banner */}
        <section className="w-full mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-6 sm:py-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black italic text-black/70 mb-3 sm:mb-4 leading-tight">
                {providerName}
              </h1>
              <p className="text-black/60 font-semibold text-sm xs:text-base leading-relaxed max-w-4xl mx-auto lg:mx-0">
                {providerExplanation}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        {providerServices.length > 0 ? (
          <div className="mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black">
                {providerServices.length} Services Available
              </h2>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {providerServices.map((service) => (
                <div key={service.id} className="flex justify-center">
                  <MainServiceCard
                    service={service}
                    onClick={() => handleServiceSelect(service)}
                  />
                </div>
              ))}
            </div>

            {/* Mobile: Horizontal Scroll Layout - Using MainServiceCard */}
            <div className="md:hidden relative">
              {providerServices.length > 1 && (
                <>
                  <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-4 h-4 text-white"
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

                  <button
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-4 h-4 text-white"
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

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                style={{
                  scrollBehavior: "smooth",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {providerServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex-none w-42 snap-center" // Same width as MainServiceCard
                  >
                    <MainServiceCard
                      service={service}
                      onClick={() => handleServiceSelect(service)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found for this provider</p>
          </div>
        )}

        {/* How We Work Section */}
        {currentService && (
          <div className="mt-12 pt-2">
            <HowWeWork service={currentService} />
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <nav className="flex items-start justify-start text-xs text-black">
            <Link
              href="/services"
              className="hover:underline transition-colors underline font-medium"
            >
              Home
            </Link>
            <span className="mx-2">•</span>
            <span className="text-black font-semibold">{providerName}</span>
          </nav>
        </div>
      </main>
      <Footer />

      {/* Add CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
