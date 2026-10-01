import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartLine, CartState, NewCartLine } from "../cart.types"
import { clampQuantity } from "../utils/clamp-quantity"

const addLine = (items: CartLine[], newLine: NewCartLine, quantity: number): CartLine[] => {
  const existingLine: CartLine | undefined = items.find((line) => line.variantId === newLine.variantId)

  if (!existingLine) {
    return [...items, { ...newLine, quantity: clampQuantity(quantity, newLine.inventoryQuantity) }]
  }

  return items.map((line) => (line === existingLine ? { ...line, quantity: clampQuantity(line.quantity + quantity, line.inventoryQuantity) } : line))
}

const setLineQuantity = (items: CartLine[], variantId: string, quantity: number): CartLine[] => {
  return items.map((line) => (line.variantId === variantId ? { ...line, quantity: clampQuantity(quantity, line.inventoryQuantity) } : line))
}

// skipHydration: the server renders an empty cart, so localStorage is read only after mount (see useCartHydration).
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (line: NewCartLine, quantity: number): void => {
        if (!line.inventoryQuantity) return
        set((state) => ({ items: addLine(state.items, line, quantity) }))
      },
      updateQuantity: (variantId: string, quantity: number): void => {
        set((state) => ({ items: setLineQuantity(state.items, variantId, quantity) }))
      },
      removeItem: (variantId: string): void => {
        set((state) => ({ items: state.items.filter((line) => line.variantId !== variantId) }))
      },
      clearCart: (): void => {
        set({ items: [] })
      },
      openCart: (): void => {
        set({ isOpen: true })
      },
      closeCart: (): void => {
        set({ isOpen: false })
      },
    }),
    {
      name: "cart",
      partialize: (state: CartState): Pick<CartState, "items"> => ({ items: state.items }),
      skipHydration: true,
    }
  )
)
