// src/components/cart/AddToCart.js
"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

export default function AddToCart({ service }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cartItem = {
      id: service.isSizeVariant
        ? `${service.originalId}-${service.selectedSize}`
        : service.id.toString(),
      name: service.displayName,
      price: service.actualPrice,
      image: service.img,
      type: service.type,
      quantity: 1,
      service: service,
    };

    addItem(cartItem);
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="bg-cartBlue text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
