import axios from "axios";

const PAYMENT_API_URL =
  process.env.NEXT_PUBLIC_PAYMENT_API_URL || "https://izinto-api.fly.dev";

class PaymentService {
  // Initialize payment with Paystack
  static async initializePayment(paymentData) {
    try {
      const response = await axios.post(
        `${PAYMENT_API_URL}/api/payments/initialize`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Payment initialization error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to initialize payment",
        details: error.response?.data?.error || error.message,
      };
    }
  }

  // Verify payment status
  static async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${PAYMENT_API_URL}/api/payments/verify/${reference}`,
        {
          timeout: 30000,
        },
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Payment verification error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to verify payment",
      };
    }
  }

  // Poll for payment status (useful for success page)
  static async pollPaymentStatus(reference, maxAttempts = 30, interval = 2000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.verifyPayment(reference);

        if (result.success && result.data.status === "success") {
          return { success: true, data: result.data };
        }

        if (result.success && result.data.status === "failed") {
          return {
            success: false,
            error: "Payment failed",
            data: result.data,
          };
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        console.error(`Poll attempt ${attempt + 1} failed:`, error);
      }
    }

    return {
      success: false,
      error: "Payment verification timeout",
    };
  }
}

export default PaymentService;
