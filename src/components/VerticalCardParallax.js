// src/components/VerticalCardParallax.js
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import VerticalCardStack from "./VerticalCardStack";

export default function VerticalCardParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Clean movement without fading - just stacking
  const firstCardY = useTransform(
    scrollYProgress,
    [0, 0.33, 1],
    ["0%", "0%", "0%"],
  );
  const secondCardY = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ["100%", "0%", "0%", "0%"],
  );
  const thirdCardY = useTransform(
    scrollYProgress,
    [0, 0.66, 1],
    ["100%", "0%", "0%"],
  );

  return (
    <div ref={ref} className="relative w-full h-[300vh] bg-white">
      {/* Container for all cards */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* First Card - Stays fixed at top */}
        <motion.div
          style={{ y: firstCardY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <VerticalCardStack
            tagline={"IMMEDIATE."}
            header={"GET IT FAST."}
            punchline={"Built for speed and convenience."}
            description={
              "Our proprietary network and real-time tech move as fast as you do—getting your order to your door in minutes."
            }
            image="/images/card1.webp"
          />
        </motion.div>

        {/* Second Card - Slides up and stays */}
        <motion.div
          style={{ y: secondCardY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <VerticalCardStack
            tagline={"SEAMLESS."}
            header={"GET IT DONE."}
            punchline={"Designed with intention."}
            description={
              "Each order is instantly routed to the relevant service provider - where it's analyzed, prepped for, and attended with zero wasted motion."
            }
            image="/images/card2.webp"
          />
        </motion.div>

        {/* Third Card - Slides up last and stays */}
        <motion.div
          style={{ y: thirdCardY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <VerticalCardStack
            tagline={"DEPENDABLE."}
            header={"GET IT RIGHT."}
            punchline={"Driven by precision."}
            description={
              "From start to finish, our platform ensures every detail is accounted for—so your service is completed accurately and to your satisfaction."
            }
            image="/images/card3.webp"
          />
        </motion.div>
      </div>
    </div>
  );
}
