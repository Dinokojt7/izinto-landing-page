"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "@/lib/api/services";
import ProductHeader from "@/components/product/ProductHeader";
import HomeBreadcrumbSection from "@/components/home/HomeBreadcrumbSection";
import ProviderSection from "@/components/home/ProviderSection";
import CircularProgressIndicator from "../ui/CircularProgessIndicator";
import {
  getProviderColor,
  getProviderImage,
  getProviderHeader,
  getProviderExplanation,
} from "@/lib/utils/providerExplanations";
import Footer from "../layout/Footer";

export default function HomeServicesComponent() {
  const router = useRouter();
  const { data: servicesData, isLoading } = useServices();
  const [groupedProviders, setGroupedProviders] = useState({});

  useEffect(() => {
    if (servicesData?.Specialties || servicesData?.specialties) {
      const services = servicesData.Specialties || servicesData.specialties;

      // Filter services to only include allowed providers
      const allowedProviders = [
        "Wegas",
        "Easy Laundry",
        "Modern8",
        "Clean Paws",
      ];

      const grouped = services.reduce((acc, service) => {
        const provider = service.provider || "Other";
        if (allowedProviders.includes(provider)) {
          if (!acc[provider]) {
            acc[provider] = [];
          }
          acc[provider].push(service);
        }
        return acc;
      }, {});

      setGroupedProviders(grouped);
    }
  }, [servicesData]);

  const handleServiceSelect = (service) => {
    const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
  };

  const handleProviderSelect = (provider) => {
    router.push(`/s/${provider.toLowerCase().replace(/\s+/g, "-")}`);
  };

  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  const providers = Object.keys(groupedProviders);

  return (
    <div className="min-h-screen bg-white">
      <ProductHeader />
      {providers.length > 0 ? (
        <>
          <HomeBreadcrumbSection />

          <main className="max-w-7xl">
            {/* Providers Grid */}
            <div className=" ">
              {providers.map((provider, index) => (
                <div
                  key={index}
                  className={`${getProviderColor(provider)} py-8`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap- mx-auto px-4 sm:px-6 lg:px-8 lg:gap-12 items-center min-h-96">
                    {/* Image Container - Comes after text on mobile */}
                    <div className="w-full h-64 lg:h-96 bg-gray-300 rounded-2xl overflow-hidden order-2 lg:order-3">
                      <img
                        src={getProviderImage(provider)}
                        alt={provider}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Text Content Container - Comes first on mobile */}
                    <div className="w-full flex flex-col justify-center items-start text-left order-1">
                      <h2 className="text-4xl lg:text-6xl font-black italic text-white mb-4 lg:mb-6 leading-tight">
                        {getProviderHeader(provider)}
                      </h2>
                      <p className="text-lg italic lg:text-lg text-white uppercase font-black mb-6 max-w-lg">
                        {getProviderExplanation(provider)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white my-6 pt-12 pb-6 mx-3 px-4 sm:px-6 lg:px-8 rounded-2xl">
                    <ProviderSection
                      key={provider}
                      provider={provider}
                      services={groupedProviders[provider]}
                      index={index}
                      onServiceSelect={handleServiceSelect}
                      onProviderSelect={handleProviderSelect}
                    />
                  </div>
                </div>
              ))}
            </div>
          </main>
          <Footer />
        </>
      ) : (
        <CircularProgressIndicator isPageLoader={true} />
      )}
    </div>
  );
}
