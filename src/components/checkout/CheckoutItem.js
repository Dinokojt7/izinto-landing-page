"use client";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import Link from "next/link";

export default function CheckoutItem({ item }) {
  const serviceModel = new NewSpecialtyModel(item);
  const price = serviceModel.actualPrice || serviceModel.firstPrice || 0;
  const itemTotal = price * item.quantity;

  const getImageSrc = () => {
    if (!item.img) return null;
    if (item.img.startsWith("http")) return item.img;
    if (item.img.startsWith("/")) return item.img;
    if (item.img.startsWith("assets/")) return `/${item.img}`;
    return item.img;
  };

  const serviceSlug = item.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Image */}
      <Link href={`/p/${serviceSlug}`} className="block w-16 h-16 shrink-0">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
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
              className="w-6 h-6"
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
      <div className="flex-1 min-w-0">
        <Link href={`/p/${serviceSlug}`}>
          <h3 className="text-base font-bold text-black hover:text-gray-700 transition-colors truncate">
            {item.name}
          </h3>
        </Link>
        {item.selectedSize && (
          <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
        )}
        <p className="text-sm text-gray-600">{item.provider || "Service"}</p>
      </div>

      {/* Quantity and Price */}
      <div className="text-right">
        <p className="text-lg font-bold text-black">R{itemTotal.toFixed(2)}</p>
        <p className="text-sm text-gray-600">
          {item.quantity} × R{price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
