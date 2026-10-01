import type { AuthSession, AuthState } from "../auth.types"

export const selectSession = (state: AuthState): AuthSession | null => state.session

export const selectSetSession = (state: AuthState): AuthState["setSession"] => state.setSession

export const selectClearSession = (state: AuthState): AuthState["clearSession"] => state.clearSession
