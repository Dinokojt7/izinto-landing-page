"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddressSnackbar, setShowAddressSnackbar] = useState(false);
  const [showAmountSnackbar, setShowAmountSnackbar] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
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

  const handlePlaceOrder = async () => {
    // Check for address
    if (!savedAddress) {
      setShowAddressSnackbar(true);
      return;
    }

    // Check minimum order amount
    if (cartTotal < MINIMUM_ORDER_AMOUNT) {
      setShowAmountSnackbar(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data in the format expected by orderBuilder
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split("@")[0] || "Customer",
        items: items.map((item) => {
          // Create a NewSpecialtyModel to get the proper structure
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
            // Pass the specialty object for serialization
            specialty: serviceModel,
          };
        }),
        subtotal: cartTotal,
        deliveryFee: 0, // Free delivery
        tipAmount: 0, // No tip system yet
        address: savedAddress,
        paymentMethod,
        orderNotes,
        status: "pending",
        paymentStatus: "pending",
        walletUsed: 0, // If you implement wallet
        promoCodeUsed: "", // If you implement promo codes
        promoDiscount: 0,
        walletPayment: false,
      };

      // Submit to Firebase using the new service
      const result = await submitOrder(orderData, user.uid);

      if (result.success) {
        // Clear cart
        clearCart();

        // Redirect to success page (replace instead of push)
        router.replace(`/checkout/success?order=${result.orderId}`);
      }
    } catch (error) {
      console.error("Order submission error:", error);

      // More user-friendly error message
      if (error.message.includes("Unsupported field value")) {
        alert(
          "There was an issue with your order data. Please try again or contact support.",
        );
      } else {
        alert("Failed to place order. Please try again.");
      }
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
        {/* <CheckoutBreadcrumbSection /> */}

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
              {/* Order Summary - FIXED: No sticky positioning */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
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

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black italic text-black">
                      Payment Method
                    </h2>
                    <button
                      onClick={() =>
                        setShowPaymentDropdown(!showPaymentDropdown)
                      }
                      className="text-[#0000ff] px-3 py-1 rounded-full text-xs font-bold transition-all transform whitespace-nowrap hover:bg-blue-100 bg-blue-50 active:scale-95 flex items-center gap-1"
                    >
                      CHANGE
                      <svg
                        className={`w-4 h-4 transition-transform ${showPaymentDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Selected Method Display */}
                  <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-black bg-black flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <p className="font-bold text-black text-sm">
                          Cash Booking
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <AnimatePresence>
                    {showPaymentDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
                          {/* Cash on Delivery (Always available) */}
                          <div
                            className={`p-3 rounded border cursor-pointer ${
                              paymentMethod === "cash"
                                ? "border-black bg-white"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              setPaymentMethod("cash");
                              setShowPaymentDropdown(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === "cash"
                                      ? "border-black bg-black"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {paymentMethod === "cash" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <p className="font-bold text-black text-sm">
                                  Cash Payment
                                </p>
                              </div>
                              {paymentMethod === "cash" && (
                                <span className="text-xs font-bold text-black">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Other Methods (Unavailable) */}
                          {["Card Payment", "Yoco Payment", "EFT Payment"].map(
                            (method) => (
                              <div
                                key={method}
                                className="p-3 rounded border border-gray-200 opacity-60 cursor-not-allowed"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                                    <div>
                                      <p className="font-bold text-black text-sm">
                                        {method}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-medium text-orange-500">
                                    Unavailable
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
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
                    `PROCEED - R${cartTotal.toFixed(2)}`
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
                    <p className="text-sm text-gray-700">
                      Currently, only Cash bookins are available. Minimum
                      booking amount is R150.
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
