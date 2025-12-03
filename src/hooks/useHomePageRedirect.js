"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useAddress } from "@/providers/AddressProvider";

export function useHomepageRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { hasValidAddress, isLoading: addressLoading } = useAddress();

  useEffect(() => {
    if (pathname === "/") {
      if (authLoading || addressLoading) return;

      if (user) {
        router.replace("/services");
        return;
      }

      if (hasValidAddress) {
        router.replace("/services");
        return;
      }
    }
  }, [pathname, user, authLoading, hasValidAddress, addressLoading, router]);

  return {
    isLoading: authLoading || addressLoading,
    shouldRedirect: !!user || hasValidAddress,
  };
}
