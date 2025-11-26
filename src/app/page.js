// src/app/page.js
"use client";
import CommunityMap from "@/components/maps/CommnunityMap";
import HeroSection from "@/components/services.js/HeroSection";
import ServiceGrid from "@/components/services.js/ServiceGrid";
import BigText from "@/components/ui/BigText";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <ServiceGrid />
      <BigText />
      <ServiceGrid shouldFlowLeft={false} />
      <CommunityMap onAddressClick={() => setIsAddressDialogOpen(true)} />
    </div>
  );
}
