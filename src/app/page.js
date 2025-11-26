// src/app/page.js

import HeroSection from "@/components/services.js/HeroSection";
import ServiceGrid from "@/components/services.js/ServiceGrid";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <ServiceGrid />
    </div>
  );
}
