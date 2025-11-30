"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

export default function AddToCartButton({ specialty }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, addItem } = useCartStore();

  // Find current item in cart to get quantity
  const cartItem = items.find(
    (item) =>
      item.id === specialty.id &&
      item.selectedSize === (specialty.selectedSize || "default"),
  );

  const quantity = cartItem?.quantity || 0;
  const _isInCart = quantity > 0;

  const handleAddToCart = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }

    setIsAnimating(true);

    // Add item to cart using the store
    addItem(specialty, 1);

    setTimeout(() => setIsAnimating(false), 300);
  };

  // Fallback if no specialty
  if (!specialty) {
    return (
      <div className="w-7 h-7 bg-black rounded-2xl flex items-center justify-center">
        <span className="text-white text-base font-semibold font-['Poppins']">
          +
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`
        w-7 h-7 bg-black text-white rounded flex items-center justify-center 
        border border-black transition-all duration-300
        ${isAnimating ? "scale-110" : "scale-100"}
        ${_isInCart ? "shadow-lg shadow-blue-500/40" : "shadow-none"}
      `}
    >
      <span
        className={`
        font-semibold text-center items-center
        ${_isInCart ? "text-sm" : "text-lg"}
      `}
      >
        {_isInCart ? quantity : "+"}
      </span>
    </button>
  );
}

// Fallback button component
function BuildAddButton({ text = "+" }) {
  return (
    <div className="w-7 h-7 bg-black rounded-2xl flex items-center justify-center">
      <span className="text-white text-base font-semibold font-['Poppins']">
        {text}
      </span>
    </div>
  );
}
