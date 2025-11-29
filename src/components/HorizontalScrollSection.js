"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

export default function CleanOverlayScroll() {
  const targetRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // All hooks must be called before any conditional returns
  const { scrollYProgress } = useScroll({
    target: isMounted && !isMobile ? targetRef : null, // Only target when not mobile
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  const images = [
    "images/onboarding-wash2.png",
    "images/onboard_wash1.jpg",
    "images/onboard_wash2.jpg",
    "images/onboard_wash.jpg",
  ];

  const largeText = "EVERYTHING.  ON-DEMAND.";

  // Now we can safely return conditionally after all hooks
  if (isMobile) {
    return (
      <section className="relative min-h-screen  py-12 px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="w-full max-w-md">
            <img
              src="images/onboard_wash.jpg"
              alt="Car Wash Service"
              className="w-full h-64 object-cover rounded-lg shadow-xl"
            />
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-black italic text-[#0096FF] mb-4">
              EVERYTHING. ON-DEMAND.
            </h2>
            <div className="flex flex-col space-y-2 items-center mb-6">
              <span className="text-xl font-black italic text-black/80">
                ALL YOUR ESSENTIALS.
              </span>
              <span className="text-xl font-black italic text-black/80">
                WHERE YOU NEED THEM.
              </span>
              <span className="text-xl font-black italic text-black/80">
                ANYTIME.
              </span>
            </div>

            <button className="bg-[#0000ff] text-white px-6 py-3.5 rounded-full text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap text-center tracking-tighter flex items-center justify-center gap-2 mx-auto">
              GET STARTED
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14m-4-6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Desktop version
  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex items-center h-screen overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex min-w-max gap-24 items-center"
        >
          {/* Your original desktop layout */}
          <div className="relative">
            <div className="relative z-50">
              <BigText text={largeText} />
            </div>

            <div className="absolute top-0 left-0 w-88 h-60 z-40 transform translate-x-10 -translate-y-45">
              <img
                src={images[0]}
                alt="Service 1"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            <div className="absolute top-1 right-0 w-88 h-60 z-40 transform -translate-x-550 -translate-y-45">
              <img
                src={images[1]}
                alt="Service 2"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            <div className="absolute top-1 right-0 w-88 h-60 z-40 transform -translate-x-150 -translate-y-45">
              <img
                src={images[1]}
                alt="Service 2"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            <div className="absolute bottom-0 left-0 w-88 h-60 z-40 transform translate-x-100 translate-y-40">
              <img
                src={images[2]}
                alt="Service 3"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            <div className="absolute bottom-0 right-0 w-88 h-60 z-40 transform -translate-x-350 translate-y-40">
              <img
                src={images[3]}
                alt="Service 4"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>

          <div className="shrink-0">
            <CTOSection />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Keep your existing CTOSection and BigText components unchanged
const CTOSection = () => {
  return (
    <div className="shrink-0 flex items-center justify-center pl-8">
      <div className="text-center">
        <div className="flex flex-col tracking-tighter -space-y-1 items-start">
          <span className="text-3xl font-black italic text-black/80">
            ALL YOUR ESSENTIALS.
          </span>
          <span className="text-3xl font-black italic text-black/80">
            WHERE YOU NEED THEM.
          </span>
          <span className="text-3xl font-black italic text-black/80">
            ANYTIME.
          </span>
          <button className="bg-blue-700 text-white px-6 py-3.5 rounded-full text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap w-1/2 text-center my-4 tracking-tighter flex items-center justify-center gap-2">
            GET STARTED
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-4-6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const BigText = ({ text }) => {
  return (
    <h2 className="text-9xl text-[16rem] whitespace-nowrap text-[#0096FF] font-black italic relative z-50">
      {text}
    </h2>
  );
};
