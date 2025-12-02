"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginDialog from "./loginDialog";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const redirect = searchParams.get("redirect") || "/services";

  useEffect(() => {
    if (!loading && user) {
      router.push(redirect);
    }
  }, [user, loading, redirect, router]);

  const handleClose = () => {
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <LoginDialog isOpen={true} onClose={handleClose} />
    </div>
  );
}
