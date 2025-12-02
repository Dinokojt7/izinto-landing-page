"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import Link from "next/link";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";

export default function CartItem({ item }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { updateQuantity, removeItem } = useCartStore();

  // Create a proper service model to get the correct price
  const serviceModel = new NewSpecialtyModel(item);
  const price = serviceModel.actualPrice || serviceModel.firstPrice || 0;
  const itemTotal = price * item.quantity;

  const handleIncrement = () => {
    updateQuantity(item.cartId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.cartId, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.cartId);
      setIsRemoving(false);
    }, 300);
  };

  const getImageSrc = () => {
    if (!item.img) return null;
    if (item.img.startsWith("http")) return item.img;
    if (item.img.startsWith("/")) return item.img;
    if (item.img.startsWith("assets/")) return `/${item.img}`;
    return item.img;
  };

  const serviceSlug = item.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isRemoving ? 0.5 : 1,
        scale: isRemoving ? 0.98 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <Link
          href={`/p/${serviceSlug}`}
          className="block sm:w-24 sm:h-24 w-full h-48 "
        >
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {getImageSrc() ? (
              <img
                src={getImageSrc()}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div className="w-full h-full hidden items-center justify-center bg-gray-200 text-gray-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Details */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Link href={`/p/${serviceSlug}`}>
              <h3 className="text-lg font-bold text-black hover:text-gray-700 transition-colors mb-1">
                {item.name}
              </h3>
            </Link>
            {item.selectedSize && (
              <p className="text-sm text-gray-600 mb-2">
                Size: {item.selectedSize}
              </p>
            )}
            <p className="text-sm text-gray-600">
              {item.provider || "Service"}
            </p>
          </div>

          {/* Quantity Controls and Total */}
          <div className="flex items-center justify-between sm:justify-end gap-6">
            {/* Item Total - Display prominently */}
            <div className="text-right">
              <p className="text-xl font-bold text-black">
                R{itemTotal.toFixed(2)}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 bg-gray-100 text-gray-700 rounded flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                -
              </button>

              <span className="text-lg font-bold min-w-8 text-center">
                {item.quantity}
              </span>

              <button
                onClick={handleIncrement}
                className="w-8 h-8 bg-gray-100 text-gray-700 rounded flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="hidden md:block text-gray-500 hover:text-red-600 transition-colors"
              title="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
