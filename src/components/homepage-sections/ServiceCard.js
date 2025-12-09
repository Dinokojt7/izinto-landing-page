"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewSpecialtyModel } from "@/lib/utils/serviceModels";

export default function ServiceCard({ service }) {
  const [selectedService, setSelectedService] = useState(
    () => new NewSpecialtyModel(service),
  );
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleSizeChange = (size) => {
    const updatedService = new NewSpecialtyModel({
      ...service,
      selectedSize: size,
      isSizeVariant: true,
      originalId: service.id,
    });
    setSelectedService(updatedService);
  };

  const handleCardClick = () => {
    const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/p/${serviceSlug}`);
  };

  const getImageSrc = () => {
    if (!service.img) return null;
    if (service.img.startsWith("http")) return service.img;
    if (service.img.startsWith("/")) return service.img;
    if (service.img.startsWith("assets/")) return `/${service.img}`;
    return service.img;
  };

  const imageSrc = getImageSrc();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col h-56 w-40" // Reduced height and width: 256px/1.6 = 160px, rounded to w-40 (160px)
      onClick={handleCardClick}
    >
      {/* Service Image Container - Fixed Size */}
      <div className="h-44 w-full bg-gray-50 flex items-center justify-center p-2 relative">
        {imageSrc && !imageError ? (
          <>
            <img
              src={imageSrc}
              alt={service.name}
              className="h-36 w-auto max-w-full object-contain" // Adjusted image size for new card
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                maxHeight: "144px", // h-36 (36 * 4 = 144px)
                maxWidth: "100%",
              }}
            />
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-400 text-xs">
                  Loading...
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-500 font-semibold text-center px-2 text-sm">
              {service.name}
            </span>
          </div>
        )}
      </div>

      {/* Light grey text at the very bottom */}
      <div className="mt-auto p-2 pt-6 items-start text-start justify-start">
        <p className="text-xs text-start text-gray-500 font-normal line-clamp-2 leading-tight min-h-10 flex items-start justify-start">
          {service.type || service.category || "Service"}
        </p>
      </div>
    </div>
  );
}
