import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthSession, AuthState, PersistedAuthState } from "../auth.types"

export const isSessionActive = (session: AuthSession | null, now: number): session is AuthSession => {
  if (!session) {
    return false
  }

  return new Date(session.expiresAt).getTime() > now
}

// Persisted so a reload or browser restart keeps the user signed in until the 1-hour token expires.
// skipHydration: the server renders signed out, so localStorage is read only after mount (see useAuthHydration).
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session: AuthSession): void => {
        set({ session })
      },
      clearSession: (): void => {
        set({ session: null })
      },
    }),
    {
      name: "auth",
      skipHydration: true,
      partialize: (state: AuthState): PersistedAuthState => ({ session: state.session }),
      // Version 1: user ids became numbers. Sessions saved by the old version are dropped, so those users sign in again.
      version: 1,
      migrate: (): PersistedAuthState => ({ session: null }),
      // A token that expired while the browser was closed is dropped instead of being restored.
      onRehydrateStorage: () => (state?: AuthState) => {
        if (state && !isSessionActive(state.session, Date.now())) {
          state.clearSession()
        }
      },
    }
  )
)
