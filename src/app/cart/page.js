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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { items, totalItems, clearCart } = useCartStore();
  const [cartTotal, setCartTotal] = useState(0);

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

  const handleContinueShopping = () => {
    router.push("/services");
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to checkout page
      router.push("/checkout");
    }, 1000);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
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
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
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
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-bold px-3 py-1 rounded-full bg-[#4bb0f96b] text-[#0096FF]">
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
                  className="bg-[#0000ff] text-white px-8 py-4 rounded-full text-base font-extrabold hover:bg-blue-800 transition-all transform whitespace-nowrap"
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
                      Free delivery on all orders. No service fees or markups.
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
      <div className="flex items-center border-t border-gray-300 p-6 flex-wrap gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
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
    </div>
  );
}
