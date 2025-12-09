import { NewSpecialtyModel } from "../utils/serviceModels";

// Helper to serialize specialty/specialtyModel objects
const serializeSpecialty = (specialty) => {
  try {
    if (!specialty) return null;

    if (specialty instanceof NewSpecialtyModel) {
      // Convert NewSpecialtyModel to serializable object
      return {
        id: specialty.id || 0,
        name: specialty.name || "Unknown Item",
        introduction: specialty.introduction || "",
        price: Array.isArray(specialty.price) ? specialty.price : [0],
        size: Array.isArray(specialty.size) ? specialty.size : ["Standard"],
        img: specialty.img || "/images/placeholder.png",
        type: specialty.type || "General",
        material: specialty.material || "Standard",
        provider: specialty.provider || "Unknown Provider",
        time: specialty.time || "",
        originalId: specialty.originalId || specialty.id || 0,
        selectedSize: specialty.selectedSize || "",
        isSizeVariant: specialty.isSizeVariant || false,
      };
    } else if (typeof specialty === "object" && specialty !== null) {
      // Already an object, ensure all fields exist
      return {
        id: specialty.id || 0,
        name: specialty.name || "Unknown Item",
        introduction: specialty.introduction || "",
        price: Array.isArray(specialty.price) ? specialty.price : [0],
        size: Array.isArray(specialty.size) ? specialty.size : ["Standard"],
        img: specialty.img || "/images/placeholder.png",
        type: specialty.type || "General",
        material: specialty.material || "Standard",
        provider: specialty.provider || "Unknown Provider",
        time: specialty.time || "",
        originalId: specialty.originalId || specialty.id || 0,
        selectedSize: specialty.selectedSize || "",
        isSizeVariant: specialty.isSizeVariant || false,
      };
    }

    return null;
  } catch (error) {
    console.error("Error serializing specialty:", error);
    return null;
  }
};

// Helper to create cart items array
const createCartItemsArray = (items) => {
  return items.map((item) => {
    // Create a proper cart model first
    const cartModel = {
      id: item.id || 0,
      name: item.name || "Unknown Item",
      price: item.price || 0,
      time: item.time || "",
      img: item.img || "/images/placeholder.png",
      type: item.type || "General",
      material: item.material || "Standard",
      quantity: item.quantity || 1,
      provider: item.provider || "Unknown Provider",
      specialty: serializeSpecialty(item),
    };

    return {
      id: cartModel.id,
      name: cartModel.name,
      price: cartModel.price,
      time: cartModel.time,
      img: cartModel.img,
      type: cartModel.type,
      material: cartModel.material,
      quantity: cartModel.quantity,
      isExist: true,
      provider: cartModel.provider,
      specialty: cartModel.specialty,
    };
  });
};

// Helper to get service types from items
const getServiceTypes = (items) => {
  const types = new Set();

  items.forEach((item) => {
    if (item.type) {
      types.add(item.type.toString());
    }
  });

  return Array.from(types);
};

// Main order builder function
export const buildOrderObject = (orderData) => {
  const {
    orderId,
    userId,
    userEmail,
    userName,
    items,
    subtotal,
    deliveryFee = 0,
    tipAmount = 0,
    address,
    paymentMethod,
    orderNotes = "",
    status = "pending",
    paymentStatus = "pending",
    walletUsed = 0,
    promoCodeUsed = "",
    promoDiscount = 0,
    walletPayment = false,
  } = orderData;

  // Create cart items with proper serialization
  const cartItems = createCartItemsArray(items);

  // Get service types
  const serviceTypes = getServiceTypes(cartItems);

  // Build the order object
  const order = {
    orderId,
    userId,
    userEmail,
    userName: userName || userEmail?.split("@")[0] || "Customer",
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: cartItems,
    subtotal: subtotal || 0,
    deliveryFee,
    tipAmount,
    totalAmount:
      (subtotal || 0) + deliveryFee + tipAmount - promoDiscount - walletUsed,
    deliveryAddress: address || {},

    // Delivery instructions
    deliveryInstructions: {
      additionalNotes: orderNotes || "",
      leaveAtDoor: false,
      dontRingBell: false,
      callWhenArrive: false,
    },

    paymentMethod,
    paymentStatus,

    // Wallet and promo info
    walletPayment,
    walletAmount: walletUsed,

    // Service info
    serviceTypes,

    // Promo code info if applicable
    ...(promoCodeUsed && {
      promoCodeUsed,
      promoDiscount,
    }),

    // Wallet info if used
    ...(walletUsed > 0 && {
      walletBalanceBefore: 0, // You would need to fetch this from user's wallet
      walletBalanceAfter: Math.max(0, 0 - walletUsed), // Adjust based on actual wallet balance
    }),
  };

  return order;
};

// Helper to clean data for Firebase
export const cleanFirebaseData = (data) => {
  if (data === undefined || data === null) {
    return null;
  }

  if (Array.isArray(data)) {
    return data.map((item) => cleanFirebaseData(item));
  }

  if (typeof data === "object" && data !== null) {
    const cleaned = {};

    Object.entries(data).forEach(([key, value]) => {
      const cleanedValue = cleanFirebaseData(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    });

    return cleaned;
  }

  return data;
};
