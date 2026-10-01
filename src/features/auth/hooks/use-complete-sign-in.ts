import { useRouter } from "next/navigation"
import type { AuthState, LoginResponse } from "../auth.types"
import { selectSetSession } from "../store/auth.selectors"
import { useAuthStore } from "../store/auth.store"

// Shared by sign-in and register: both routes return a session, which is saved before going to `redirectTo`.
export const useCompleteSignIn = (redirectTo: string): ((response: LoginResponse) => void) => {
  const router = useRouter()
  const setSession: AuthState["setSession"] = useAuthStore(selectSetSession)

  return (response: LoginResponse): void => {
    setSession(response)
    router.replace(redirectTo)
  }
}
