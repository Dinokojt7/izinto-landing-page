import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { generateShortOrderId } from "@/lib/utils/orderIdGenerator";
import { buildOrderObject, cleanFirebaseData } from "./orderBuilder";

export const submitOrder = async (orderData, userId) => {
  try {
    // Generate order ID
    const orderId = generateShortOrderId();

    // Build complete order object
    const completeOrderData = {
      ...orderData,
      orderId,
      userId,
    };

    const order = buildOrderObject(completeOrderData);

    // Clean the data for Firebase (remove undefined values)
    const cleanedOrder = cleanFirebaseData(order);

    // Save to main orders collection
    await setDoc(doc(db, "orders", orderId), cleanedOrder);

    // Also save to user's subcollection
    await setDoc(doc(db, "users", userId, "orders", orderId), cleanedOrder);

    return {
      success: true,
      orderId,
      orderData: cleanedOrder,
    };
  } catch (error) {
    console.error("Error submitting order:", error);

    // More detailed error logging
    if (error.message.includes("Unsupported field value")) {
      console.error(
        "Problematic order data:",
        JSON.stringify(orderData, null, 2),
      );
    }

    throw error;
  }
};

// Optional: Function to update wallet if you implement it
export const updateUserWallet = async (userId, amount) => {
  try {
    const userRef = doc(db, "users", userId);

    // You might want to use a transaction for this
    // For now, simple update
    await setDoc(
      userRef,
      {
        wallet: amount,
        lastWalletUpdate: new Date().toISOString(),
      },
      { merge: true },
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating wallet:", error);
    throw error;
  }
};
