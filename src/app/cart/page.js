"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import { Poppins } from "next/font/google";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import ProductHeader from "@/components/product/ProductHeader";
import CartBreadcrumbSection from "./CartBreadCrumbSection";
import CartItem from "@/components/cart/CartItem";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/lib/context/AuthContext";
import LoginDialog from "@/app/auth/login/loginDialog";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { items, totalItems, clearCart } = useCartStore();
  const [cartTotal, setCartTotal] = useState(0);
  const { user } = useAuth();

  // Calculate cart total whenever items change
  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;

      items.forEach((item) => {
        const serviceModel = new NewSpecialtyModel(item);
        const price = serviceModel.actualPrice || serviceModel.firstPrice || 0;
        total += price * item.quantity;
      });

      setCartTotal(total);
    };

    calculateTotal();
  }, [items]);

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  const handleContinueShopping = () => {
    router.push("/services");
  };

  // const handleCheckout = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);

  //     if (!user) {
  //       //  setIsLoginDialogOpen(true);

  //       setShowSnackbar(true);
  //     } else {
  //       router.push("/checkout");
  //     }
  //   }, 500); // Shorter timeout for better UX
  // };

  const handleCheckout = () => {
    if (!user) {
      setShowSnackbar(true);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(true);
        router.push("/checkout");
      }, 500);
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false);
    router.push("/checkout");
  };

  const handleSnackbarLogin = () => {
    setShowSnackbar(false);
    setIsLoginDialogOpen(true);
  };

  if (isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <ProductHeader />
      <CartBreadcrumbSection itemCount={totalItems} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-5">
          {items.length > 0 && (
            <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-2">
              Your Basket
            </h1>
          )}
          {totalItems < 0 && (
            <p className="text-gray-600">
              Your basket is empty. Start adding items!
            </p>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.cartId} item={item} />
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Clear All Items
                </button>
                <div className="text-right sm:hidden">
                  <p className="text-lg font-bold text-black">
                    R{cartTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border text-center items-center border-gray-200 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-black italic text-black mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-black">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery/Logistics</span>
                    <span className="font-semibold px-3 py-1 text-xs  rounded-full bg-[#4bb0f935] text-[#0096FF]">
                      FREE
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className=" font-bold text-black">Total</span>
                    <span className=" font-black text-black">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="bg-[#0000ff] text-white px-8 py-3 rounded-full text-base font-black italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
                >
                  PROCEED TO CHECKOUT
                </motion.button>

                {/* Continue Shopping */}
                <Link href="/services">
                  <button
                    onClick={handleContinueShopping}
                    className="w-full text-center mt-5 text-black rounded-full shadow bg-white py-4 hover:text-black transition-colors text-sm"
                  >
                    Continue Booking
                  </button>
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 border border-[#0096FF] rounded-lg bg-blue-50">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-[#0096FF] mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-700">
                      Logistic fees covered for all orders. No service fees or
                      markups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <img
                src="/images/basket.png"
                alt="Basket"
                className="w-24 h-24 text-gray-300"
              />
            </div>
            <h2 className="text-2xl font-black italic text-black mb-4">
              Your basket is empty
            </h2>
            <p className="text-gray-600 mb-8 text-sm max-w-md mx-auto">
              Add items to your basket to see them here. Browse our services to
              find what you need.
            </p>

            <Link href="/services">
              <motion.button
                onClick={handleContinueShopping}
                className=" px-6 text-center mt-5 text-white font-black uppercase text-sm rounded-full  bg-[#0000FF] py-3 cursor-pointer transition-colors italic"
              >
                Continue Booking
              </motion.button>
            </Link>
          </div>
        )}
      </main>

      <div className="flex items-center border-t border-gray-100 p-6 flex-wrap gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
        <Link
          href="/services"
          className="whitespace-nowrap hover:text-black transition-colors cursor-pointer"
        >
          Home
        </Link>
        <span>•</span>
        <span className="font-semibold text-black whitespace-nowrap">
          Basket
        </span>
      </div>

      <Footer />

      {/* Login Dialog */}
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      {showSnackbar && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:w-auto sm:transform sm:-translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-black text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 sm:px-6 sm:py-4">
            {/* Message - single line on mobile */}
            <span className="font-medium text-sm sm:text-base truncate flex-1">
              Please login to continue checkout
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSnackbarLogin}
                className="bg-white text-black px-3 py-1 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                LOGIN
              </button>
              <button
                onClick={() => setShowSnackbar(false)}
                className="text-gray-300 hover:text-white text-lg sm:text-base"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
