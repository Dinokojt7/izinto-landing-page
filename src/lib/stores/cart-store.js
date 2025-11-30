import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addItem: (service, quantity = 1) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) =>
            item.id === service.id &&
            item.selectedSize === service.selectedSize,
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
          // Add new item
          const newItem = {
            ...service,
            quantity,
            cartId: `${service.id}-${service.selectedSize || "default"}-${Date.now()}`,
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
    }),
    {
      name: "cart-storage",
    },
  ),
);
