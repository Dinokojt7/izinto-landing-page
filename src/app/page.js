"use client";
import { useState, useRef, useEffect } from "react";
import StaggeredHorizontalScroll from "@/components/HorizontalScrollSection";
import Footer from "@/components/layout/Footer";
import CommunityMap from "@/components/maps/CommnunityMap";
import PromoSection from "@/components/PromoSection";
import HeroSection from "@/components/services/HeroSection";
import ServiceGrid from "@/components/services/ServiceGrid";
import BigText from "@/components/ui/BigText";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import { Inter } from "next/font/google";
import VerticalCardParallax from "@/components/VerticalCardParallax";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { useAddress } from "@/providers/AddressProvider";
import { useHomepageRedirect } from "@/hooks/useHomePageRedirect";

const inter = Inter({ weight: ["400", "900"], subsets: ["latin"] });

export default function Home() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);
  const heroSectionRef = useRef(null);

  const { isLoading } = useHomepageRedirect();
  const { saveAddress } = useAddress();

  // Show loading while checking redirect conditions
  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroRect = heroSectionRef.current.getBoundingClientRect();
        const isHeroOutOfView = heroRect.bottom <= 0;
        setShowBottomButton(isHeroOutOfView);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAddressSave = (addressData) => {
    saveAddress(addressData); // Use the context method
    setIsAddressDialogOpen(false);

    // Optionally redirect after saving valid address
    if (addressData.isValid) {
      // You could add a small delay and redirect here
      // setTimeout(() => router.push("/services"), 1000);
    }
  };

  return (
    <div className={`pt-16 pb-20 sm:pb-0 bg-white ${inter.className}`}>
      <div ref={heroSectionRef}>
        <HeroSection />
      </div>
      <ServiceGrid />
      <BigText />
      <ServiceGrid shouldFlowLeft={false} />
      <CommunityMap onAddressClick={() => setIsAddressDialogOpen(true)} />
      <PromoSection />
      <VerticalCardParallax />
      <div className="my-20" />
      <StaggeredHorizontalScroll />
      <Footer />

      {showBottomButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-4">
          <button
            onClick={() => setIsAddressDialogOpen(true)}
            className="bg-[#0000ff] text-white px-6 py-3 rounded-full text-sm font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap w-full text-center"
          >
            ENTER YOUR ADDRESS
          </button>
        </div>
      )}

      <AddressSearchDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressSave={handleAddressSave}
      />
    </div>
  );
}
