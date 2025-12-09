"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgressIndicator from "./CircularProgessIndicator";

export default function PageLoader() {
  const [isPending, startTransition] = useTransition();
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Track if we're in a transition
  useEffect(() => {
    if (isPending) {
      // Show loader immediately when transition starts
      setShowLoader(true);
    } else {
      // Hide loader with a slight delay to avoid flicker
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isPending]);

  // Intercept all link clicks
  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest("a");
      if (
        link &&
        link.href &&
        !link.href.startsWith("http") &&
        !event.defaultPrevented
      ) {
        event.preventDefault();
        const href = link.getAttribute("href");
        if (href) {
          startTransition(() => {
            router.push(href);
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [router, startTransition]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <CircularProgressIndicator isPageLoader={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
