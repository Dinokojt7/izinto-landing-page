"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { useCartStore } from "@/lib/stores/cart-store";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function MainServiceCard({ service }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const { items, removeItem } = useCartStore();

  const handleCardClick = () => {
    const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
  };

  // Find item in cart for bin button
  const cartItem = items.find((item) => {
    const matchesById = item.id === service?.id;
    const matchesByOriginalId =
      service?.originalId && item.id === service.originalId;
    const sizeMatches = item.selectedSize === (service?.selectedSize || "");
    return (matchesById || matchesByOriginalId) && sizeMatches;
  });

  const quantity = cartItem?.quantity || 0;

  const handleRemoveAll = (e) => {
    e.stopPropagation();
    if (cartItem) {
      removeItem(cartItem.cartId);
    }
  };

  const getImageSrc = () => {
    if (!service.img) return null;
    if (service.img.startsWith("http")) return service.img;
    if (service.img.startsWith("/")) return service.img;
    if (service.img.startsWith("assets/")) return `/${service.img}`;
    return service.img;
  };

  const imageSrc = getImageSrc();

  return (
    <div
      className={`flex-none w-42 h-64 bg-white pt-4 rounded-lg shadow border border-gray-100 px-4  duration-300 snap-start cursor-pointer relative ${poppins.className}`}
      onClick={handleCardClick}
    >
      {/* Service Image */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-lg flex items-center justify-center bg-gray-50">
          {imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt={service.name}
              className="w-24 h-24 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-gray-400">
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
          )}
        </div>
      </div>

      {/* Service Details with Price */}
      <div className="space-y-2 mb-4">
        <h3 className="text-sm justify-start items-start text-black line-clamp-2 h-10">
          {service.name}
        </h3>
        <div className="flex justify-start items-start">
          <div className="text-xs text-gray-500 font-normal whitespace-nowrap">
            R{service.price?.[0] || 0}.00
          </div>
        </div>
      </div>

      {/* Action Row with Bin and Expandable Add Button */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {/* Bin Button (Left) */}
        <div onClick={handleRemoveAll} className="z-10">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: quantity > 0 ? 1 : 0.3,
              scale: quantity > 0 ? 1 : 0.9,
            }}
            transition={{ duration: 0.2 }}
            className={`p-1.5 rounded-full ${quantity > 0 ? "hover:bg-red-50 cursor-pointer" : "cursor-default"}`}
            disabled={quantity === 0}
            title={quantity > 0 ? "Remove all from cart" : "Item not in cart"}
          >
            <svg
              className={`w-4 h-4 ${quantity > 0 ? "text-red-500" : "text-gray-300"}`}
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
          </motion.button>
        </div>

        {/* Expandable Add to Cart Button (Right) */}
        <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
          <AddToCartButton specialty={service} />
        </div>
      </div>
    </div>
  );
}
