// app/auth/callback/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading, isCheckingRedirect } = useAuth();
  const [status, setStatus] = useState("Processing authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Wait a moment for AuthContext to process the redirect
      setTimeout(async () => {
        if (!loading && !isCheckingRedirect) {
          if (user) {
            setStatus("Authentication successful! Redirecting...");
            // Redirect to home or profile page
            setTimeout(() => {
              router.push("/");
            }, 1500);
          } else {
            setStatus("Authentication failed. Redirecting to login...");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          }
        }
      }, 1000);
    };

    handleAuthCallback();
  }, [user, loading, isCheckingRedirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{status}</h2>
        <p className="text-gray-600 mb-6">
          Please wait while we complete your authentication...
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>If you're not redirected automatically,</p>
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              Click here to continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
