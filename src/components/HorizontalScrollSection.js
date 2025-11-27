import React, { useRef, useEffect } from "react";

const CleanOverlayScroll = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const atStart = container.scrollLeft <= 0;
      const atEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1;

      if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;

      e.preventDefault();
      container.scrollLeft += e.deltaY * 1.5;
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const images = [
    "images/onboard_wash.jpg", // Laundry - top
    "https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?w=300&h=200&fit=crop", // Gas - bottom
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop", // Car wash - top
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop", // Service - bottom
  ];

  const largeText = "WANT IT. GET IT.";

  return (
    <div className="min-h-screen bg-white">
      <div
        ref={scrollContainerRef}
        className="w-full h-screen overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex min-w-max h-full items-center">
          {/* Section 1: First image on top */}
          <div className="flex-shrink-0 w-screen flex items-center justify-center">
            <div className="relative">
              <span className="text-9xl font-black z-50 text-blue-400">
                {largeText}
              </span>
              <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-64 h-48">
                <img
                  src={images[0]}
                  alt="Laundry Service"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: First image on bottom */}
          <div className="flex-shrink-0 w-screen flex items-center justify-center">
            <div className="relative">
              <span className="text-9xl font-black text-blue-400">
                {largeText}
              </span>
              <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-48">
                <img
                  src={images[1]}
                  alt="Gas Refill"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Second image on top */}
          <div className="flex-shrink-0 w-screen flex items-center justify-center">
            <div className="relative">
              <span className="text-9xl font-black text-blue-400">
                {largeText}
              </span>
              <div className="absolute -top-32 right-32 w-64 h-48 transform -rotate-6">
                <img
                  src={images[2]}
                  alt="Car Wash"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Second image on bottom */}
          <div className="flex-shrink-0 w-screen flex items-center justify-center">
            <div className="relative">
              <span className="text-9xl font-black text-blue-400">
                {largeText}
              </span>
              <div className="absolute -bottom-32 left-32 w-64 h-48 transform rotate-6">
                <img
                  src={images[3]}
                  alt="Service"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Final Section: Services and Button */}
          <div className="flex-shrink-0 w-screen flex items-center justify-center">
            <div className="text-center">
              <div className="flex flex-col space-y-6 items-center">
                <span className="text-2xl font-bold text-gray-800">
                  ON-DEMAND LAUNDRY
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  SPEEDY GAS REFILL
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  CAR WASH SERVICES
                </span>

                <button className="bg-blue-500 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors mt-6">
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanOverlayScroll;
