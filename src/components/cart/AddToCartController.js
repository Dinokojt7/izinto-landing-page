"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartControllers({ service }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const cartItem = items.find(
    (item) =>
      item.id === service.id && item.selectedSize === service.selectedSize,
  );

  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    setIsAnimating(true);
    addItem(service, 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleIncrement = () => {
    updateQuantity(cartItem.cartId, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(cartItem.cartId, quantity - 1);
    } else {
      removeItem(cartItem.cartId);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleAddToCart}
            className="bg-[#0000ff] text-white px-8 py-4 rounded-full text-base font-extrabold italic hover:bg-blue-800 transition-all transform whitespace-nowrap"
          >
            MAKE A BOOKING
          </motion.button>
        ) : (
          <motion.div
            key="cart-controls"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-4 bg-gray-100 rounded-full px-4 py-2"
          >
            <button
              onClick={handleDecrement}
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              -
            </button>

            <span className="text-lg font-bold min-w-8 text-center">
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              +
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
