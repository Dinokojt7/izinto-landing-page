"use client";
import { useState } from "react";
import { getProviderDetails } from "@/lib/utils/providerExplanations";
import { getDetailIcon } from "@/lib/utils/svgIcons";
import AddToCartControllers from "../cart/AddToCartController";

export default function ProductInfoSection({ service }) {
  const [imageError, setImageError] = useState(false);
  const details = getProviderDetails(service.provider, service.details);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="flex justify-center">
          <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {service.img && !imageError ? (
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 font-semibold">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <h1 className="text-xl font-black italic text-black leading-tight">
            {service.name}
          </h1>

          {/* Price */}
          <p className="text-xs font-bold italic text-gray-700">
            R{service.actualPrice || service.firstPrice}
          </p>

          {/* Provider/Type */}
          <p className="text-sm text-gray-600">{service.type}</p>

          {/* Add to Cart Controllers */}
          <AddToCartControllers service={service} />

          {/* Details Grid */}
          <div className="border border-[#0096FF] rounded-2xl p-6 bg-white mt-8">
            <div className="h-6 flex items-center">
              <p className="text-sm font-bold italic text-black">
                WE'VE GOT YOU COVERED.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {details.map((detail, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      {getDetailIcon(
                        typeof detail === "object"
                          ? detail.key
                          : Object.keys(detail)[0],
                      )}
                    </span>
                    <span className="text-xs font-black italic text-black">
                      {typeof detail === "object"
                        ? detail.key
                        : Object.keys(detail)[0]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {typeof detail === "object"
                      ? detail.value
                      : Object.values(detail)[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Introduction */}
          <div className="pt-6  border-gray-300">
            <h3 className="text-sm font-semibold text-black w-full border-b border-gray-300 mb-2">
              Introduction
            </h3>
            <p className="text-sm text-gray-700 line-clamp-3">
              {service.introduction}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
