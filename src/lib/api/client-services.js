// src/lib/api/client-services.js
export async function fetchServicesClient() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://gregarious-marshmallow-0b7661.netlify.app/.netlify/functions/api";

  const endpoints = [
    "/laundry",
    "/gas-refill",
    "/carpet-care",
    "/pet-care",
    "/home-items",
  ];

  // Mock data delete later
  const mockServices = [
    {
      id: 1,
      name: "Laundry Service",
      price: [120, 150],
      size: ["Standard", "Large"],
      img: "/images/laundry.jpg",
      type: "Laundry",
    },
    {
      id: 2,
      name: "Gas Refill",
      price: [300, 600, 1500],
      size: ["9kg", "19kg", "48kg"],
      img: "/images/gas.jpg",
      type: "Gas Refill",
    },
    {
      id: 3,
      name: "Carpet Cleaning",
      price: [100],
      size: ["Per sqm"],
      img: "/images/carpet.jpg",
      type: "Carpet Care",
    },
    {
      id: 4,
      name: "Pet Care",
      price: [110],
      size: ["Standard"],
      img: "/images/pet-care.jpg",
      type: "Pet Care",
    },
    {
      id: 5,
      name: "Blanket Cleaning",
      price: [120, 150],
      size: ["Double", "King"],
      img: "/images/blankets.jpg",
      type: "Laundry",
    },
    {
      id: 6,
      name: "Sneaker Cleaning",
      price: [100],
      size: ["All Sizes"],
      img: "/images/sneakers.jpg",
      type: "Footwear",
    },
    {
      id: 7,
      name: "Curtain Cleaning",
      price: [200, 300],
      size: ["Standard", "Large"],
      img: "/images/curtains.jpg",
      type: "Home Care",
    },
    {
      id: 8,
      name: "Upholstery Cleaning",
      price: [250, 350],
      size: ["Chair", "Sofa"],
      img: "/images/upholstery.jpg",
      type: "Home Care",
    },
    {
      id: 9,
      name: "Mattress Cleaning",
      price: [180, 220],
      size: ["Single", "Double"],
      img: "/images/mattress.jpg",
      type: "Home Care",
    },
    {
      id: 10,
      name: "Car Interior Cleaning",
      price: [400],
      size: ["Standard"],
      img: "/images/car-cleaning.jpg",
      type: "Auto Care",
    },
  ];

  try {
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`);

          // First check if response is OK and content type
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const text = await response.text();

          // Check if response is HTML (starts with <)
          if (
            text.trim().startsWith("<!DOCTYPE") ||
            text.trim().startsWith("<")
          ) {
            throw new Error("HTML response received");
          }

          // Try to parse as JSON
          try {
            const data = JSON.parse(text);

            // Extract services from different formats
            if (Array.isArray(data)) return data;
            if (data.Specialties) return data.Specialties;
            if (data.specialties) return data.specialties;
            return [];
          } catch (parseError) {
            throw new Error("Invalid JSON");
          }
        } catch (error) {
          console.warn(`Client: ${endpoint} failed:`, error.message);
          return [];
        }
      }),
    );

    // Combine successful results
    const apiServices = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );

    // Use API services if we got any, otherwise use mock
    const finalServices = apiServices.length > 0 ? apiServices : mockServices;

    // Create sequential display
    const sequentialServices = [];
    const maxLength = Math.max(...results.map((r) => r.value?.length || 0));

    for (let i = 0; i < maxLength; i++) {
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value && result.value[i]) {
          sequentialServices.push(result.value[i]);
        }
      });
    }

    // If no sequential from API, use the final services as-is
    const displayServices =
      sequentialServices.length > 0 ? sequentialServices : finalServices;

    return displayServices;
  } catch (error) {
    console.error(`Client: ${error}`, error);
    return mockServices;
  }
}
