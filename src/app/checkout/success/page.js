"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductHeader from "@/components/product/ProductHeader";
import { Poppins } from "next/font/google";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) {
      setOrderId(order);
      setIsLoading(false);
    } else {
      // If no order ID, redirect to home
      router.replace("/");
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0000ff]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white mt-4 ${poppins.className}`}>
      <ProductHeader />

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-gray-600 mb-2">
            Thank you for your booking. We've received it and will process it
            shortly.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto my-6">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <p className="text-2xl font-black text-black tracking-wider">
              {orderId}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Keep this reference for any inquiries about your booking
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <p className="text-gray-600 text-sm">
              You will receive an email confirmation shortly. Our team will
              contact you to confirm your booking details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#0000ff] text-white px-8 py-3 rounded-full text-base font-black italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
                >
                  RETURN HOME
                </motion.button>
              </Link>

              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-[#0000ff] text-[#0000ff] px-8 py-3 rounded-full text-base font-black italic hover:bg-blue-50 transition-all transform whitespace-nowrap"
                >
                  BOOK MORE SERVICES
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
