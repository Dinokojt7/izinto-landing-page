import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

export default function MainServiceCard({ service }) {
  const [quantity, setQuantity] = useState(0);

  const addToCart = () => {
    setQuantity((prev) => prev + 1);
  };

  // Helper functions to get service data (adjust based on your API response structure)
  const getPrice = (item) => {
    return item.price || item.Price || 0;
  };

  const getDescription = (item) => {
    return item.description || item.Description || item.name || item.Name || "";
  };

  const getType = (item) => {
    return item.type || item.Type || item.category || item.Category || "";
  };

  const getImageSrc = () => {
    if (!service.img) return null;
    // Handle different image path formats
    if (service.img.startsWith("http")) return service.img;
    if (service.img.startsWith("/")) return service.img;
    if (service.img.startsWith("assets/")) return `/${service.img}`;
    return service.img;
  };

  return (
    <div className="flex-none w-42 h-64 bg-white pt-4 rounded-2xl shadow-sm border border-black/10 px-4 hover:shadow-md transition-shadow duration-300 snap-start">
      {/* Service Image */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-lg flex items-center justify-center">
          <img
            src={getImageSrc()}
            alt={service.name}
            className="w-24 h-24 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className="w-12 h-12 hidden items-center justify-center text-gray-400">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-700 font-semibold mb-3 line-clamp-2 leading-tight ">
          {getType(service)}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-between items-center">
        <button className="text-sm text-gray-900 font-bold mb-3 line-clamp-2 leading-tight   ">
          R{service.price[0]}.00*
        </button>

        {/* Add to Cart Button */}
        <AddToCartButton specialty={service} />
      </div>
    </div>
  );
}
