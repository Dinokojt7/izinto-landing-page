"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export default function MobileServiceCard({ service, onClick }) {
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();

  const addToCart = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(service);
    } else {
      const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/p/${serviceSlug}`);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart button
    addToCart();
  };

  const getImageSrc = () => {
    if (!service.img) return null;
    if (service.img.startsWith("http")) return service.img;
    if (service.img.startsWith("/")) return service.img;
    if (service.img.startsWith("assets/")) return `/${service.img}`;
    return service.img;
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow duration-200 active:scale-[0.99]"
      onClick={handleCardClick}
    >
      {/* Service Image - Compact */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <img
          src={getImageSrc()}
          alt={service.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="w-full h-full hidden items-center justify-center  text-gray-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      {/* Service Details - Compact */}
      <div className="p-2 flex flex-col flex-1">
        {/* Service Type/Name - Compact */}
        <div className="mb-1 flex-1">
          <div className="text-[10px] text-gray-600 font-medium line-clamp-2 leading-tight">
            {service.type || service.category || "Service"}
          </div>
        </div>

        {/* Action Row - Compact */}
        <div className="flex items-center justify-between pt-1 ">
          <div className="text-xs font-bold text-gray-900">
            R{service.price?.[0] || 0}*
          </div>
          <div onClick={handleAddToCartClick}>
            <AddToCartButton specialty={service} />
          </div>
        </div>
      </div>
    </div>
  );
}
