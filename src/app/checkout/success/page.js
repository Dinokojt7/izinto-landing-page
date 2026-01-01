"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductHeader from "@/components/product/ProductHeader";
import { Poppins } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { usePayment } from "@/lib/context/PaymentContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPaymentOnSuccess } = usePayment();

  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("verifying");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const orderIdFromUrl = searchParams.get("order");

      if (!reference) {
        // If no reference but has order ID, it's a cash booking
        if (orderIdFromUrl) {
          setOrderId(orderIdFromUrl);
          setPaymentStatus("cash_booking");
          setIsLoading(false);
          return;
        }
        // No reference or order ID, redirect to home
        router.replace("/");
        return;
      }

      try {
        setOrderId(orderIdFromUrl || "");

        const result = await verifyPaymentOnSuccess(reference);

        if (result.success) {
          setPaymentStatus("success");
          setPaymentDetails(result.data);
        } else {
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router, verifyPaymentOnSuccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0000ff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  const renderSuccessContent = () => {
    if (paymentStatus === "cash_booking") {
      return (
        <>
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
            Cash Booking Confirmed
          </h1>

          <p className="text-gray-600 mb-2">
            Thank you for your booking. We have received your cash booking
            request.
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

          <p className="text-gray-600 text-sm">
            Our team will contact you to confirm your booking details and
            arrange payment upon delivery.
          </p>
        </>
      );
    }

    if (paymentStatus === "success") {
      return (
        <>
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
            Payment Successful
          </h1>

          <p className="text-gray-600 mb-2">
            Thank you for your payment. Your booking is being processed.
          </p>

          {paymentDetails && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto my-6">
              <h3 className="font-bold text-black mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-sm">
                    {paymentDetails.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold">
                    R{(paymentDetails.amount / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-bold text-green-600">Paid</span>
                </div>
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{orderId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-gray-600 text-sm">
            You will receive an email confirmation shortly. Our team will
            contact you to confirm your booking details.
          </p>
        </>
      );
    }

    if (paymentStatus === "failed") {
      return (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-4">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-6">
            Your payment could not be processed. Please try again.
          </p>

          <Link href="/checkout">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-3 rounded-full text-base font-black italic hover:bg-gray-800 transition-all transform whitespace-nowrap"
            >
              Return to Checkout
            </motion.button>
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-4">
          Verification Error
        </h1>

        <p className="text-gray-600 mb-6">
          We encountered an issue verifying your payment. Please contact support
          with your order details.
        </p>
      </>
    );
  };

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
          {renderSuccessContent()}

          {(paymentStatus === "success" ||
            paymentStatus === "cash_booking") && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#0000ff] text-white px-8 py-3 rounded-full text-base font-black italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
                >
                  Return Home
                </motion.button>
              </Link>

              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-[#0000ff] text-[#0000ff] px-8 py-3 rounded-full text-base font-black italic hover:bg-blue-50 transition-all transform whitespace-nowrap"
                >
                  Book More Services
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
