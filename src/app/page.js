// src/app/page.js
"use client";
import StaggeredHorizontalScroll from "@/components/HorizontalScrollSection";
import CommunityMap from "@/components/maps/CommnunityMap";
import PromoSection from "@/components/PromoSection";
import HeroSection from "@/components/services.js/HeroSection";
import ServiceGrid from "@/components/services.js/ServiceGrid";
import BigText from "@/components/ui/BigText";
import VerticalCardStack from "@/components/VerticalCardStack";

export default function Home() {
  return (
    <div className="pt-16">
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
    </div>
  );
}
