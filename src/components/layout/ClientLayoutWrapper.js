// src/components/layout/ClientLayoutWrapper.js
"use client";

import PageLoader from "@/components/ui/PageLoader";
import { usePageLoader } from "@/hooks/usePageLoader";

export default function ClientLayoutWrapper({ children }) {
  const isLoading = usePageLoader();

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
}
