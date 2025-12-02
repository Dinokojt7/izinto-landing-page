"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "@/lib/api/services";
import ProductHeader from "@/components/product/ProductHeader";
import HomeBreadcrumbSection from "@/components/home/HomeBreadcrumbSection";
import ProviderSection from "@/components/home/ProviderSection";
import CircularProgressIndicator from "../ui/CircularProgessIndicator";

export default function HomeServicesComponent() {
  const router = useRouter();
  const { data: servicesData, isLoading } = useServices();
  const [groupedProviders, setGroupedProviders] = useState({});

  useEffect(() => {
    if (servicesData?.Specialties || servicesData?.specialties) {
      const services = servicesData.Specialties || servicesData.specialties;

      // Group services by provider
      const grouped = services.reduce((acc, service) => {
        const provider = service.provider || "Other";
        if (!acc[provider]) {
          acc[provider] = [];
        }
        acc[provider].push(service);
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
      <HomeBreadcrumbSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Providers Grid */}
        <div className="space-y-12">
          {providers.map((provider, index) => (
            <ProviderSection
              key={provider}
              provider={provider}
              services={groupedProviders[provider]}
              index={index}
              onServiceSelect={handleServiceSelect}
              onProviderSelect={handleProviderSelect}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
