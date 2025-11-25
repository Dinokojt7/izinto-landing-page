// src/components/services.js/ServiceCard.js
"use client";
import { useState } from "react";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";
import AddToCart from "@/components/cart/AddToCart";

export default function ServiceCard({ service }) {
  const [selectedService, setSelectedService] = useState(
    () => new NewSpecialtyModel(service),
  );

  const handleSizeChange = (size) => {
    const updatedService = new NewSpecialtyModel({
      ...service,
      selectedSize: size,
      isSizeVariant: true,
      originalId: service.id,
    });
    setSelectedService(updatedService);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {/* Service image placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-accent">
          <span className="text-primary font-semibold">{service.name}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          {service.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {service.introduction}
        </p>

        {/* Size selector */}
        {service.size && service.size.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Size:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-cartBlue focus:border-cartBlue"
              value={selectedService.selectedSize}
              onChange={(e) => handleSizeChange(e.target.value)}
            >
              {service.size.map((sizeOption, index) => (
                <option key={index} value={sizeOption}>
                  {sizeOption} - R
                  {service.price?.[index] || service.price?.[0] || 0}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price and add to cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-cartBlue">
            R{selectedService.actualPrice}
          </span>
          <AddToCart service={selectedService} />
        </div>
      </div>
    </div>
  );
}
