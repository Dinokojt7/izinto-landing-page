// src/components/ui/PageLoader.js
"use client";
import { useEffect, useState } from "react";
import CircularProgressIndicator from "./CircularProgessIndicator";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen to Next.js routing events
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleStart);

      // For Next.js app router, you can use these events
      // You might need to set up a proper loading state context
    }

    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, []);

  if (!isLoading) return null;

  return <CircularProgressIndicator isPageLoader={true} />;
}
