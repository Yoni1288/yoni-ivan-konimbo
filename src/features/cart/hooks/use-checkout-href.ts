import type { AuthSession } from "@/features/auth/auth.types"
import { useAuthHydration } from "@/features/auth/hooks/use-auth-hydration"
import { selectSession } from "@/features/auth/store/auth.selectors"
import { isSessionActive, useAuthStore } from "@/features/auth/store/auth.store"
import { getLoginPath } from "@/features/auth/utils/redirect-path"
import { CHECKOUT_PATH } from "@/features/checkout/checkout.constants"

// Signed-out shoppers go straight to sign-in (then back to checkout) instead of loading checkout just to be redirected.
// The checkout page checks the session itself as well, so this is only a shortcut, not the protection.
export const useCheckoutHref = (): string => {
  const isSessionLoaded: boolean = useAuthHydration()
  const session: AuthSession | null = useAuthStore(selectSession)

  if (isSessionLoaded && !isSessionActive(session, Date.now())) {
    return getLoginPath(CHECKOUT_PATH)
  }

  return CHECKOUT_PATH
}
