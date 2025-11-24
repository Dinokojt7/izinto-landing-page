// src/lib/stores/cart-store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          const updatedItems = items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
          set({ items: updatedItems })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (id) => {
        const { items } = get()
        set({ items: items.filter(i => i.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter(i => i.id !== id) })
        } else {
          set({
            items: items.map(i =>
              i.id === id ? { ...i, quantity } : i
            )
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      }
    }),
    {
      name: 'izinto-cart-storage',
    }
  )
)