import { useEffect } from "react"
import { useCartStore } from "../store/cart.store"

export const useCartHydration = (): void => {
  useEffect(() => {
    void useCartStore.persist.rehydrate()
  }, [])
}
