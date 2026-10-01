import { useEffect, useSyncExternalStore } from "react"
import { useCartStore } from "../store/cart.store"

const subscribeToHydration = (onChange: () => void): (() => void) => {
  return useCartStore.persist.onFinishHydration(onChange)
}

const getHasHydrated = (): boolean => useCartStore.persist.hasHydrated()

const getServerHasHydrated = (): boolean => false

// Returns whether the saved cart has been loaded, so pages can show a loading state instead of a briefly empty cart.
export const useCartHydration = (): boolean => {
  useEffect(() => {
    if (!useCartStore.persist.hasHydrated()) {
      void useCartStore.persist.rehydrate()
    }
  }, [])

  return useSyncExternalStore(subscribeToHydration, getHasHydrated, getServerHasHydrated)
}
