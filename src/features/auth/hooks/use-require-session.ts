import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { AuthSession } from "../auth.types"
import { selectSession } from "../store/auth.selectors"
import { isSessionActive, useAuthStore } from "../store/auth.store"
import { getLoginPath } from "../utils/redirect-path"
import { useAuthHydration } from "./use-auth-hydration"

// For pages that need a signed-in user: sends everyone else to sign-in with `?next=` pointing back here.
// Returns true once there is an active session; also redirects if the user logs out while on the page.
export const useRequireSession = (returnTo: string): boolean => {
  const router = useRouter()
  const isSessionLoaded: boolean = useAuthHydration()
  const session: AuthSession | null = useAuthStore(selectSession)
  const isSignedIn: boolean = isSessionLoaded && isSessionActive(session, Date.now())

  useEffect(() => {
    if (isSessionLoaded && !isSignedIn) {
      router.replace(getLoginPath(returnTo))
    }
  }, [isSessionLoaded, isSignedIn, returnTo, router])

  return isSignedIn
}
