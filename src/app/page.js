// src/app/page.js
"use client";
import { useState } from "react";
import StaggeredHorizontalScroll from "@/components/HorizontalScrollSection";
import Footer from "@/components/layout/Footer";
import CommunityMap from "@/components/maps/CommnunityMap";
import PromoSection from "@/components/PromoSection";
import HeroSection from "@/components/services/HeroSection";
import ServiceGrid from "@/components/services/ServiceGrid";
import BigText from "@/components/ui/BigText";
import VerticalCardStack from "@/components/VerticalCardStack";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import { Inter, Roboto } from "next/font/google";

const inter = Inter({ weight: ["400", "900"], subsets: ["latin"] });

const roboto = Roboto({
  weight: ["400", "900"],
  subsets: ["latin"],
});

export default function Home() {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const handleAddressSave = (address) => {
    // Handle address save logic here
    console.log("Address saved:", address);
    setIsAddressDialogOpen(false);
  };

  return (
    <div className={`pt-16 pb-20 sm:pb-0 ${inter.className} `}>
      {" "}
      {/* Added bottom padding for mobile nav */}
      <HeroSection />
      <ServiceGrid />
      <BigText />
      <ServiceGrid shouldFlowLeft={false} />
      <CommunityMap onAddressClick={() => setIsAddressDialogOpen(true)} />
      <PromoSection />
      <VerticalCardStack
        tagline={"IMMEDIATE."}
        header={"GET IT FAST."}
        punchline={"Built for speed and convenience."}
        description={
          "Our proprietary network and real-time tech move as fast as you do—getting your order to your door in minutes."
        }
      />
      <VerticalCardStack
        tagline={"SEAMLESS."}
        header={"GET IT DONE."}
        punchline={"Designed with intention."}
        description={
          "Each order is instantly routed to the relevant serivce provider - where it's analyzed, prepped for, and attended with zero wasted motion."
        }
      />
      <VerticalCardStack
        tagline={"DEPENDABLE."}
        header={"GET IT RIGHT."}
        punchline={"Driven by precision."}
        description={
          "From start to finish, our platform ensures every detail is accounted for—so your service is completed accurately and to your satisfaction."
        }
      />
      <StaggeredHorizontalScroll />
      <Footer />
      {/* Mobile Bottom Nav Address Button - Fixed position */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden  p-4">
        <button
          onClick={() => setIsAddressDialogOpen(true)}
          className="bg-[#0000ff] text-white px-6 py-3 rounded-full text-sm font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap w-full text-center"
        >
          ENTER YOUR ADDRESS
        </button>
      </div>
      {/* Address Search Dialog */}
      <AddressSearchDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressSave={handleAddressSave}
      />
    </div>
  );
}
