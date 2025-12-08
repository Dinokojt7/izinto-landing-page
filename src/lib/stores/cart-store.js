import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addItem: (service, quantity = 1) => {
        // Extract the raw ID - handle both NewSpecialtyModel and plain objects
        const serviceId = service.originalId || service.id;
        const selectedSize = service.selectedSize || "";

        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) =>
            (item.id === serviceId || item.originalId === serviceId) &&
            item.selectedSize === selectedSize,
        );

        if (existingItemIndex > -1) {
          // Update quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({
            items: updatedItems,
            totalItems: get().totalItems + quantity,
          });
        } else {
          // Add new item - store raw data
          const newItem = {
            id: serviceId,
            originalId: service.originalId,
            name: service.name,
            price: service.price,
            size: service.size,
            img: service.img,
            details: service.details,
            type: service.type,
            material: service.material,
            provider: service.provider,
            time: service.time,
            selectedSize: selectedSize,
            quantity,
            cartId: `${serviceId}-${selectedSize || "default"}-${Date.now()}`,
          };
          set({
            items: [...items, newItem],
            totalItems: get().totalItems + quantity,
          });
        }
      },

      removeItem: (cartId) => {
        const items = get().items;
        const itemToRemove = items.find((item) => item.cartId === cartId);
        if (itemToRemove) {
          const updatedItems = items.filter((item) => item.cartId !== cartId);
          set({
            items: updatedItems,
            totalItems: Math.max(0, get().totalItems - itemToRemove.quantity),
          });
        }
      },

      updateQuantity: (cartId, newQuantity) => {
        const items = get().items;
        const itemIndex = items.findIndex((item) => item.cartId === cartId);

        if (itemIndex > -1 && newQuantity > 0) {
          const updatedItems = [...items];
          const quantityDiff = newQuantity - updatedItems[itemIndex].quantity;
          updatedItems[itemIndex].quantity = newQuantity;
          set({
            items: updatedItems,
            totalItems: get().totalItems + quantityDiff,
          });
        } else if (newQuantity === 0) {
          get().removeItem(cartId);
        }
      },

      clearCart: () => {
        set({ items: [], totalItems: 0 });
      },

      // Helper: Check if a service is in cart
      isServiceInCart: (service) => {
        const serviceId = service.originalId || service.id;
        const selectedSize = service.selectedSize || "";
        return get().items.some(
          (item) =>
            (item.id === serviceId || item.originalId === serviceId) &&
            item.selectedSize === selectedSize,
        );
      },

      // Helper: Get quantity for a service
      getServiceQuantity: (service) => {
        const serviceId = service.originalId || service.id;
        const selectedSize = service.selectedSize || "";
        const item = get().items.find(
          (item) =>
            (item.id === serviceId || item.originalId === serviceId) &&
            item.selectedSize === selectedSize,
        );
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
