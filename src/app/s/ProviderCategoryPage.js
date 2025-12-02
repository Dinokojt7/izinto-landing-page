"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useServices } from "@/lib/api/services";
import { getProviderExplanation } from "@/lib/utils/providerExplanations";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import CategoryBreadcrumbSection from "./ProviderBreadcrumbSection";
import MainServiceCard from "@/components/ui/MainServiceCard";
import ProductHeader from "@/components/product/ProductHeader";
import Link from "next/link";
import MobileServiceCard from "@/components/ui/MobileServiceCard";

export default function ProviderCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { data: servicesData, isLoading } = useServices();
  const [providerServices, setProviderServices] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
      }
    }

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [servicesData, params.provider]);

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
        {/* Provider Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-black italic text-black">
              {providerExplanation}
            </h1>
          </div>
        </div>

        {/* Services Grid */}
        {providerServices.length > 0 ? (
          <>
            {/* Desktop: 5 columns */}
            <div className="hidden md:grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {providerServices.map((service) => (
                <div key={service.id} className="flex justify-center">
                  <div className="w-full max-w-xs">
                    <MainServiceCard
                      service={service}
                      onClick={() => handleServiceSelect(service)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: 3 columns with MobileServiceCard */}
            <div className="md:hidden grid grid-cols-3 gap-4">
              {providerServices.map((service) => (
                <div key={service.id} className="w-full">
                  <MobileServiceCard
                    service={service}
                    onClick={() => handleServiceSelect(service)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found for this provider</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <nav className="flex items-start justify-start text-xs text-black">
            <Link
              href="/services"
              className="hover:underline transition-colors font-medium"
            >
              Home
            </Link>
            <span className="mx-2">•</span>
            <span className="text-black font-semibold">{providerName}</span>
          </nav>
        </div>
      </main>
    </div>
  );
}
