// AddToCartButton component
"use client";
import { useState } from "react";
export default function AddToCartButton({ specialty }) {
  const [quantity, setQuantity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const _isInCart = quantity > 0;

  const handleAddToCart = () => {
    setIsAnimating(true);
    setQuantity((prev) => prev + 1);
    // Call your cart controller here
    // cartController.addItem(specialty, 1);

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
