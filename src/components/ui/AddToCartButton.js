"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartButton({ specialty }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  // Find item in cart
  const cartItem = items.find((item) => {
    const matchesById = item.id === specialty?.id;
    const matchesByOriginalId =
      specialty?.originalId && item.id === specialty.originalId;
    const sizeMatches = item.selectedSize === (specialty?.selectedSize || "");
    return (matchesById || matchesByOriginalId) && sizeMatches;
  });

  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const triggerHapticFeedback = () => {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "vibrate" in navigator
    ) {
      navigator.vibrate(50); // 50ms vibration for mobile devices
    }
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    triggerHapticFeedback();
    setIsAnimating(true);
    addItem(specialty, 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleIncrement = (e) => {
    if (e) e.stopPropagation();
    setIsAnimating(true);
    if (cartItem) {
      updateQuantity(cartItem.cartId, quantity + 1);
    } else {
      addItem(specialty, 1);
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDecrement = (e) => {
    if (e) e.stopPropagation();
    setIsAnimating(true);
    if (!cartItem) return;

    if (quantity > 1) {
      updateQuantity(cartItem.cartId, quantity - 1);
    } else {
      removeItem(cartItem.cartId);
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  if (!specialty) {
    return (
      <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
        <span className="text-white text-base font-semibold">+</span>
      </div>
    );
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait">
        {!isInCart ? (
          // Simple Add Button
          <motion.button
            key="add-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isAnimating ? 1.2 : 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddToCart}
            className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center border border-black hover:shadow-lg hover:shadow-blue-500/40 transition-all"
          >
            <span className="text-lg font-semibold">+</span>
          </motion.button>
        ) : (
          // Expanded Quantity Controller
          <motion.div
            key="quantity-controller"
            initial={{ opacity: 0, scale: 0.8, width: 28 }}
            animate={{
              opacity: 1,
              scale: 1,
              width: 96,
            }}
            exit={{ opacity: 0, scale: 0.8, width: 28 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex items-center justify-between bg-black text-white rounded-full px-3 h-7 overflow-hidden shadow-lg"
          >
            {/* Decrement Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDecrement}
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors `}
              aria-label="Decrease quantity"
              title={quantity === 1 ? "Remove item" : "Decrease quantity"}
            >
              <span className="font-bold text-base leading-none">−</span>
            </motion.button>

            {/* Quantity Display */}
            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold mx-2 min-w-6 text-center"
            >
              {quantity}
            </motion.span>

            {/* Increment Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleIncrement}
              className="w-6 h-6  rounded-full flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <span className="font-bold text-base leading-none">+</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
