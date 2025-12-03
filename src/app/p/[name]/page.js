"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/lib/api/services";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import ProductHeader from "@/components/product/ProductHeader";
import BreadcrumbSection from "@/components/product/BreadCrumbSection";
import CategoryBanner from "@/components/product/CategoryBanner";
import ProductInfoSection from "@/components/product/ProductInfoSection";
import SimilarServices from "@/components/product/SimilarServices";
import YouMightAlsoLike from "@/components/product/YouMightAlsoLike";
import { Poppins } from "next/font/google";
import Footer from "@/components/layout/Footer";
import HowWeWork from "@/components/services/HowWeWork";
import BottomBreadcrumbSection from "@/components/product/BottomBreadCrumbSection";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: servicesData, isLoading } = useServices();
  const [currentService, setCurrentService] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    if (servicesData?.Specialties || servicesData?.specialties) {
      const services = servicesData.Specialties || servicesData.specialties;
      setAllServices(services);

      // Find current service by name from URL
      const serviceName = decodeURIComponent(params.name);
      const foundService = services.find(
        (service) =>
          service.name.toLowerCase().replace(/\s+/g, "-") ===
          serviceName.toLowerCase(),
      );

      if (foundService) {
        const serviceModel = new NewSpecialtyModel(foundService);
        setCurrentService(serviceModel);

        // Find similar services by provider
        const similar = services.filter(
          (service) =>
            service.provider === foundService.provider &&
            service.id !== foundService.id,
        );
        setSimilarServices(similar.map((s) => new NewSpecialtyModel(s)));
      }
    }
  }, [servicesData, params.name]);

  const handleServiceSelect = (service) => {
    const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
  };

  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgressIndicator isPageLoader={true} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <ProductHeader />
      <BreadcrumbSection service={currentService} />
      <CategoryBanner service={currentService} />
      <ProductInfoSection service={currentService} />
      <YouMightAlsoLike
        services={allServices}
        currentService={currentService}
        onServiceSelect={handleServiceSelect}
      />{" "}
      <HowWeWork service={currentService} />
      <BottomBreadcrumbSection service={currentService} />
      <Footer />
    </div>
  );
}
