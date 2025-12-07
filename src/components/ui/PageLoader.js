// src/components/ui/PageLoader.js
"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgressIndicator from "./CircularProgessIndicator";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [pathname, searchParams]); 

  return (
    <AnimatePresence>
      {isLoading && (
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
