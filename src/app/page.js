// src/app/page.js

import HeroSection from "@/components/services.js/HeroSection";


export default function Home() {
  return (
    <div className="pt-16"> {/* Add padding to account for fixed header */}
      <HeroSection />
      {/* <ServiceGrid /> */}
    </div>
  )
}