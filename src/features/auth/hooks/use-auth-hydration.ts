import { useEffect, useSyncExternalStore } from "react"
import { useAuthStore } from "../store/auth.store"

const subscribeToHydration = (onChange: () => void): (() => void) => {
  return useAuthStore.persist.onFinishHydration(onChange)
}

const getHasHydrated = (): boolean => useAuthStore.persist.hasHydrated()

const getServerHasHydrated = (): boolean => false

// Same shape as useCartHydration: loads the saved session after mount and reports when it is ready.
export const useAuthHydration = (): boolean => {
  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated()) {
      void useAuthStore.persist.rehydrate()
    }
  }, [])

  return useSyncExternalStore(subscribeToHydration, getHasHydrated, getServerHasHydrated)
}
