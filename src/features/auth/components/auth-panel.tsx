"use client"

import type { AuthPanelProps, AuthSession } from "../auth.types"
import { useAuthHydration } from "../hooks/use-auth-hydration"
import { selectSession } from "../store/auth.selectors"
import { isSessionActive, useAuthStore } from "../store/auth.store"
import { AuthCardSkeleton } from "./auth-card"
import { SignedInCard } from "./signed-in-card"

// Signed-in users get the account card with Log out; everyone else gets `children` (the sign-in or register card).
export const AuthPanel = ({ children }: AuthPanelProps): React.JSX.Element => {
  const isSessionLoaded: boolean = useAuthHydration()
  const session: AuthSession | null = useAuthStore(selectSession)

  if (!isSessionLoaded) {
    return <AuthCardSkeleton />
  }

  if (isSessionActive(session, Date.now())) {
    return <SignedInCard session={session} />
  }

  return <>{children}</>
}
