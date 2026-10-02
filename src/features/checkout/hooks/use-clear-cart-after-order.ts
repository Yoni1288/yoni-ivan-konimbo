import { useEffect } from "react"
import { useCartHydration } from "@/features/cart/hooks/use-cart-hydration"
import type { CartState } from "@/features/cart/cart.types"
import { useCartStore } from "@/features/cart/store/cart.store"

// Runs after the confirmation has rendered, and only once the saved cart is loaded, so a later rehydrate can't bring the items back.
export const useClearCartAfterOrder = (): void => {
  const isCartReady: boolean = useCartHydration()
  const clearCart: CartState["clearCart"] = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (isCartReady) clearCart()
  }, [isCartReady, clearCart])
}
