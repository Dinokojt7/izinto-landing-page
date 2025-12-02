"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CircularProgressIndicator from "../ui/CircularProgessIndicator";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = "/auth/login",
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
