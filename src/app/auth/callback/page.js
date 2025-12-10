// app/auth/callback/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, profileComplete, isCheckingRedirect } = useAuth();

  useEffect(() => {
    if (!loading && !isCheckingRedirect) {
      if (user) {
        // Redirect based on profile completion
        if (profileComplete) {
          router.push("/"); // Or stored return path
        } else {
          router.push("/profile");
        }
      } else {
        // If auth failed, go back to login
        router.push("/login");
      }
    }
  }, [user, loading, profileComplete, isCheckingRedirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
