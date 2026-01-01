"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PaymentService from "@/lib/services/paymentService";
import { submitOrder } from "@/lib/services/orderService";

const PaymentContext = createContext({});

export const PaymentProvider = ({ children }) => {
  const router = useRouter();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [currentReference, setCurrentReference] = useState("");

  // Process card payment
  const processCardPayment = useCallback(async (orderData, user, cartItems) => {
    try {
      setPaymentProcessing(true);
      setPaymentError("");

      // 1. Submit order to Firebase first (to get order ID)
      const orderResult = await submitOrder(orderData, user.uid);

      if (!orderResult.success) {
        throw new Error("Failed to create order");
      }

      const orderId = orderResult.orderId;

      // 2. Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        const price = item.actualPrice || item.firstPrice || 0;
        return total + price * item.quantity;
      }, 0);

      // 3. Initialize payment with Paystack
      const paymentData = {
        email: user.email,
        amount: totalAmount,
        metadata: {
          orderId: orderId,
          userId: user.uid,
          userName: user.displayName || user.email.split("@")[0],
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.actualPrice || item.firstPrice,
          })),
        },
      };

      const paymentResult = await PaymentService.initializePayment(paymentData);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment initialization failed");
      }

      // 4. Store reference for verification
      setCurrentReference(paymentResult.data.reference);

      // 5. Redirect to Paystack
      window.location.href = paymentResult.data.authorization_url;

      return {
        success: true,
        orderId,
        reference: paymentResult.data.reference,
        authorizationUrl: paymentResult.data.authorization_url,
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentError(error.message || "Payment processing failed");
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setPaymentProcessing(false);
    }
  }, []);

  // Verify payment on success page
  const verifyPaymentOnSuccess = useCallback(async (reference) => {
    try {
      setPaymentProcessing(true);

      const result = await PaymentService.pollPaymentStatus(reference);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: "Payment verified successfully",
        };
      } else {
        return {
          success: false,
          error: result.error,
          data: result.data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setPaymentProcessing(false);
    }
  }, []);

  const clearError = () => {
    setPaymentError("");
  };

  const value = {
    paymentProcessing,
    paymentError,
    currentReference,
    processCardPayment,
    verifyPaymentOnSuccess,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
};
