"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import ProductHeader from "@/components/product/ProductHeader";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import OrderNotesDialog from "@/components/checkout/OrderNotesDialog";
import CircularProgressIndicator from "@/components/ui/CircularProgessIndicator";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/context/AuthContext";
import { useAddress } from "@/providers/AddressProvider";
import { submitOrder } from "@/lib/services/orderService";
import AddressSnackbar from "@/components/checkout/AddressSnackbar";
import AddressSearchDialog from "@/components/maps/AddressSearchDialog";
import AddressSelectionDialog from "@/components/maps/AddressSelectionDialog";
import Footer from "@/components/layout/Footer";
import AmountSnackbar from "@/components/checkout/AmountSnackbar";

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
  const [orderNotes, setOrderNotes] = useState("");
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showAddressSnackbar, setShowAddressSnackbar] = useState(false);
  const [showAmountSnackbar, setShowAmountSnackbar] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Use AddressProvider hook
  const {
    activeAddress: savedAddress,
    hasAddresses,
    saveAddress,
  } = useAddress();

  const MINIMUM_ORDER_AMOUNT = 150;

  // Form validation state
  const isFormValid =
    savedAddress && cartTotal >= MINIMUM_ORDER_AMOUNT && items.length > 0;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
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

  const handleAddressSave = (addressData) => {
    saveAddress(addressData);
    setIsAddressDialogOpen(false);
  };

  const handleAddressButtonClick = () => {
    if (hasAddresses) {
      setIsAddressSelectionOpen(true);
    } else {
      setIsAddressDialogOpen(true);
    }
  };

  const handleCardPayment = async () => {
    console.log("1. Starting card payment process...");
    
    // Check for address
    if (!savedAddress) {
      console.log("Address validation failed: No address saved");
      setShowAddressSnackbar(true);
      return;
    }

    // Check minimum order amount
    if (cartTotal < MINIMUM_ORDER_AMOUNT) {
      console.log(`Amount validation failed: Cart total (${cartTotal}) < minimum (${MINIMUM_ORDER_AMOUNT})`);
      setShowAmountSnackbar(true);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("2. Preparing order data...");
      
      // Prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split("@")[0] || "Customer",
        items: items.map((item) => {
          const serviceModel = new NewSpecialtyModel(item);
          return {
            id: item.id || item.cartId || `item_${Date.now()}_${Math.random()}`,
            name: item.name || "Unknown Item",
            price: serviceModel.actualPrice || serviceModel.firstPrice || 0,
            time: item.time || "",
            img: item.img || "/images/placeholder.png",
            type: item.type || "General",
            material: item.material || "Standard",
            quantity: item.quantity || 1,
            provider: item.provider || "Unknown Provider",
            specialty: serviceModel,
          };
        }),
        subtotal: cartTotal,
        deliveryFee: 0,
        tipAmount: 0,
        address: savedAddress,
        paymentMethod: "card",
        orderNotes,
        status: "pending",
        paymentStatus: "pending",
        walletUsed: 0,
        promoCodeUsed: "",
        promoDiscount: 0,
        walletPayment: false,
      };

      console.log("3. Submitting order to Firebase...");
      console.log("Order data:", orderData);
      
      // 1. First submit order to Firebase to get order ID
      const orderResult = await submitOrder(orderData, user.uid);

      console.log("4. Firebase order result:", orderResult);
      
      if (!orderResult.success) {
        throw new Error("Failed to create order: " + JSON.stringify(orderResult));
      }

      const orderId = orderResult.orderId;
      console.log("5. Order created with ID:", orderId);

      // 2. Initialize payment with our backend API
      const paymentData = {
        email: user.email,
        amount: cartTotal,
        metadata: {
          orderId: orderId,
          userId: user.uid,
          userName: user.displayName || user.email.split("@")[0],
          items: items.map((item) => {
            const serviceModel = new NewSpecialtyModel(item);
            return {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: serviceModel.actualPrice || serviceModel.firstPrice || 0,
            };
          }),
        },
      };

      console.log("6. Calling payment API with data:", paymentData);
      
      const paymentResponse = await fetch(
        "https://izinto-api.fly.dev/api/payments/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      console.log("7. Payment API response status:", paymentResponse.status);
      console.log("8. Payment API response headers:", paymentResponse.headers);
      
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("Payment API error response:", errorText);
        throw new Error(`Payment API error: ${paymentResponse.status} - ${errorText}`);
      }
      
      const paymentResult = await paymentResponse.json();
      console.log("9. Payment API response:", paymentResult);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment initialization failed: " + JSON.stringify(paymentResult));
      }

      console.log("10. Payment initialized successfully");
      console.log("11. Redirect URL:", paymentResult.data.authorization_url);
      
      // 3. Clear cart immediately before redirect
      clearCart();

      // 4. Redirect to Paystack payment page
      window.location.href = paymentResult.data.authorization_url;

    } catch (error) {
      console.error("12. Card payment error:", error);
      
      // Log the full error object
      console.error("Full error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      let errorMessage = "Payment processing failed. Please try again.";
      
      // Check for specific errors
      if (error.message.includes("Failed to create order")) {
        errorMessage = "Failed to create order. Please try again.";
      } else if (error.message.includes("Payment initialization")) {
        errorMessage = "Payment gateway error. Please try again.";
      } else if (error.message.includes("fetch") || error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes("Payment API error")) {
        errorMessage = "Payment service is temporarily unavailable. Please try again in a few minutes.";
      }
      
      alert(`${errorMessage}\n\nError: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return <CircularProgressIndicator isPageLoader={true} />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <div className={`min-h-screen bg-white py-8 my-8 ${poppins.className}`}>
        <ProductHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Page Header */}
          <div className="relative w-full h-18 sm:h-48 mb-10 overflow-hidden rounded-xl sm:rounded-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("/images/checkout.png")',
              }}
            ></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-5xl font-black italic text-white mb-2">
                Checkout
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black italic text-black">
                    Address
                  </h2>
                  <button
                    onClick={handleAddressButtonClick}
                    className="text-[#0000ff] px-3 py-1 rounded-full text-xs font-bold transition-all transform whitespace-nowrap hover:bg-blue-100 bg-blue-50 active:scale-95"
                  >
                    CHANGE
                  </button>
                </div>

                {savedAddress ? (
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-black">
                      {savedAddress.street}
                    </p>
                    <p className="text-gray-600 text-sm">{savedAddress.town}</p>
                    <p className="text-gray-600 text-sm">
                      {savedAddress.province}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {savedAddress.postalCode}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4 text-sm">
                      No address saved
                    </p>
                    <button
                      onClick={() => setIsAddressDialogOpen(true)}
                      className="text-[#0000ff] px-3 py-1 rounded-full text-xs font-bold transition-all transform whitespace-nowrap hover:bg-blue-100 bg-blue-50 active:scale-95"
                    >
                      ADD DELIVERY ADDRESS
                    </button>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl  font-black italic text-black">
                    Booking Items
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {items.length}
                    {items.length != 1 ? " Items" : " Item"}
                  </p>
                </div>
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
                    Booking Notes
                  </h2>
                  <button
                    onClick={() => setShowNotesDialog(true)}
                    className="text-[#0000ff] px-3 py-1 rounded-full text-xs font-bold transition-all transform whitespace-nowrap hover:bg-blue-100 bg-blue-50 active:scale-95"
                  >
                    {orderNotes ? "EDIT NOTES" : "ADD NOTES"}
                  </button>
                </div>

                {orderNotes ? (
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {orderNotes}
                  </p>
                ) : (
                  <p className="text-gray-500 italic text-sm">No notes added</p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-black italic text-black mb-6">
                  Booking Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Subtotal</span>
                    <span className="font-bold text-black text-sm">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Delivery/Logistics
                    </span>
                    <span className="font-semibold px-3 py-1 text-xs  rounded-full bg-[#4bb0f935] text-[#0096FF]">
                      FREE
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-sm">Total</span>
                    <span className="text-xl font-black text-black">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method - Card Only */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="relative">
                  <h2 className="text-xl font-black italic text-black mb-6">
                    Payment Method
                  </h2>

                  {/* Card Payment Display */}
                  <div className="p-4 rounded-lg border border-gray-300 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                        <img
                          src="/images/card-payments.png"
                          alt="Card"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-black text-sm">
                          Card Payment
                        </p>
                        <p className="text-xs text-gray-600">
                          Secure online payment
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Unavailable Methods */}
                  <div className="space-y-3">
                    <div className="p-3 rounded border border-gray-200 opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                            <img
                              src="/images/cash-payments.png"
                              alt="Cash"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-bold text-black text-sm">
                            Cash Booking
                          </p>
                        </div>
                        <span className="text-xs font-medium text-orange-500">
                          Unavailable
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded border border-gray-200 opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                            <img
                              src="/images/yoco-payment-link.png"
                              alt="Yoco"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-bold text-black text-sm">
                            Yoco Payment
                          </p>
                        </div>
                        <span className="text-xs font-medium text-orange-500">
                          Unavailable
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded border border-gray-200 opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                            <img
                              src="/images/eft-payment.png"
                              alt="EFT"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="font-bold text-black text-sm">
                            EFT Payment
                          </p>
                        </div>
                        <span className="text-xs font-medium text-orange-500">
                          Unavailable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCardPayment}
                  disabled={isSubmitting || !isFormValid}
                  className={`w-full px-6 py-3 rounded-full text-base font-black italic transition-all transform whitespace-nowrap ${
                    isFormValid
                      ? "bg-[#0000ff] text-white hover:bg-blue-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `PAY NOW - R${cartTotal.toFixed(2)}`
                  )}
                </motion.button>
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
                    <p className="text-xs text-gray-700">
                      Secure card payments only. Minimum booking amount is R150.
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You'll be redirected to a secure payment page.
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

        {/* Address Dialogs */}
        <AddressSelectionDialog
          isOpen={isAddressSelectionOpen}
          onClose={() => setIsAddressSelectionOpen(false)}
          showAddressSearchDialog={() => setIsAddressDialogOpen(true)}
        />

        <AddressSearchDialog
          isOpen={isAddressDialogOpen}
          onClose={() => setIsAddressDialogOpen(false)}
          onAddressSave={handleAddressSave}
        />

        {/* Address Snackbar */}
        <AddressSnackbar
          isOpen={showAddressSnackbar}
          onClose={() => setShowAddressSnackbar(false)}
          onAddAddress={() => {
            setShowAddressSnackbar(false);
            handleAddressButtonClick();
          }}
        />

        {/* Amount Snackbar */}
        <AmountSnackbar
          isOpen={showAmountSnackbar}
          onClose={() => setShowAmountSnackbar(false)}
          minimumAmount={MINIMUM_ORDER_AMOUNT}
        />

        <Footer />
      </div>
    </AuthGuard>
  );
}