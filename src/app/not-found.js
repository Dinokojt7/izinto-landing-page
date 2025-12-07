// app/not-found.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function NotFound() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [notFoundPath, setNotFoundPath] = useState("");

  useEffect(() => {
    // Get the original path that caused the 404
    const fromPath = searchParams.get("from") || window.location.pathname;
    setNotFoundPath(fromPath);
  }, [searchParams]);

  const handleGoHome = () => {
    if (user) {
      router.push("/services");
    } else {
      router.push("/");
    }
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col ${poppins.className}`}>
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <img
          src="/images/try-retro.png"
          alt="Retro Logo"
          className="w-28 h-auto sm:w-30"
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Basket Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <img
            src="/images/basket.png"
            alt="Basket"
            className="w-32 h-32 text-gray-300"
          />
        </motion.div>

        {/* Page not found text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-black tracking-tight text-black mb-4">
            Page not found.
          </h2>
          <p className="text-black/80 mb-8 text-base font-semibold">
            We can't find what you're looking for
          </p>
        </motion.div>

        {/* Attempted URL - Subtle display */}
        {notFoundPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-xs text-gray-400">
              Tried to find:{" "}
              <span className="font-mono text-gray-500">{notFoundPath}</span>
            </p>
          </motion.div>
        )}

        {/* Back to Home Button - Matches text width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoHome}
            className="w-full bg-[#0096ff] text-white px-6 py-3 rounded-full text-base font-extrabold hover:bg-blue-500 transition-all"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
