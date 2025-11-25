// src/components/services.js/HorizontalScroll.js
"use client";
import ServiceCard from "./ServiceCard";

export default function HorizontalScroll({ services }) {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
        {services.map((service) => (
          <div key={service.id} className="flex-none w-80">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
}
