"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import ProductHeader from "@/components/product/ProductHeader";
import CheckoutBreadcrumbSection from "@/components/checkout/CheckoutBreadcrumbSection";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import OrderNotesDialog from "@/components/checkout/OrderNotesDialog";
import PaymentMethodDialog from "@/components/checkout/PaymentMethodDialog";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/context/AuthContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }

    const saved = localStorage.getItem("userAddress");
    if (saved) {
      setSavedAddress(JSON.parse(saved));
    }

    // Calculate cart total
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
  }, [authLoading, user, router, items]);

  const handlePlaceOrder = async () => {
    if (!savedAddress) {
      alert("Please add a delivery address first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price:
            new NewSpecialtyModel(item).actualPrice ||
            new NewSpecialtyModel(item).firstPrice,
          quantity: item.quantity,
          size: item.selectedSize,
          provider: item.provider,
          image: item.img,
        })),
        total: cartTotal,
        address: savedAddress,
        paymentMethod,
        orderNotes,
        status: "pending",
        createdAt: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };

      // Here you would send to Firebase
      // const orderRef = await addDoc(collection(db, "orders"), orderData);

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear cart on success
      clearCart();

      // Redirect to success page
      router.push(`/checkout/success?order=${orderData.orderNumber}`);
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  if (authLoading || isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <div className={`min-h-screen bg-white ${poppins.className}`}>
        <ProductHeader />
        <CheckoutBreadcrumbSection />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black italic text-black mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">
              Review your order and complete your purchase
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black italic text-black">
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => router.push("/")}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Change
                  </button>
                </div>

                {savedAddress ? (
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-black">
                      {savedAddress.street}
                    </p>
                    <p className="text-gray-600">{savedAddress.town}</p>
                    <p className="text-gray-600">{savedAddress.province}</p>
                    <p className="text-gray-600">{savedAddress.postalCode}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">No address saved</p>
                    <button
                      onClick={() => router.push("/")}
                      className="text-[#0096FF] hover:underline font-medium"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-black italic text-black mb-6">
                  Order Items ({items.length})
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <CheckoutItem key={item.cartId} item={item} />
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black italic text-black">
                    Order Notes
                  </h2>
                  <button
                    onClick={() => setShowNotesDialog(true)}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {orderNotes ? "Edit" : "Add Notes"}
                  </button>
                </div>

                {orderNotes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {orderNotes}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No notes added</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-black italic text-black mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-black">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-bold text-[#0096FF]">FREE</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-2xl font-black text-black">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black italic text-black">
                    Payment Method
                  </h2>
                  <button
                    onClick={() => setShowPaymentDialog(true)}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-lg border ${
                      paymentMethod === "cash"
                        ? "border-[#0096FF] bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "cash"
                              ? "border-[#0096FF] bg-[#0096FF]"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "cash" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black">
                            Cash on Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Pay when you receive
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "cash" && (
                        <span className="text-sm font-bold text-[#0096FF]">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dimmed out payment options */}
                  <div className="p-4 rounded-lg border border-gray-200 opacity-40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                        <div>
                          <p className="font-bold text-black">Card Payment</p>
                          <p className="text-sm text-gray-600">
                            Pay with credit/debit card
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Coming Soon</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 opacity-40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                        <div>
                          <p className="font-bold text-black">Yoco Payment</p>
                          <p className="text-sm text-gray-600">
                            Secure online payment
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Coming Soon</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 opacity-40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                        <div>
                          <p className="font-bold text-black">EFT Payment</p>
                          <p className="text-sm text-gray-600">Bank transfer</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !savedAddress || items.length === 0}
                  className="w-full bg-black text-white py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "PLACE ORDER"
                  )}
                </motion.button>

                <button
                  onClick={handleBackToCart}
                  className="w-full text-center text-gray-600 hover:text-black transition-colors text-sm"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* Additional Info */}
              <div className="p-4 border border-[#0096FF] rounded-lg bg-blue-50">
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
                    <p className="text-sm text-gray-700">
                      Your order will be delivered to the address provided.
                      Payment is cash on delivery only at this time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Dialogs */}
        <OrderNotesDialog
          isOpen={showNotesDialog}
          onClose={() => setShowNotesDialog(false)}
          notes={orderNotes}
          onSave={(notes) => {
            setOrderNotes(notes);
            setShowNotesDialog(false);
          }}
        />

        <PaymentMethodDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          selectedMethod={paymentMethod}
          onSelect={(method) => {
            setPaymentMethod(method);
            setShowPaymentDialog(false);
          }}
        />
      </div>
    </AuthGuard>
  );
}
