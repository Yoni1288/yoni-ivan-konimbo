import type { z } from "zod"
import type { loginResponseSchema, loginSchema, registerCredentialsSchema, registerFormSchema, seedAdminEnvSchema } from "./auth.schemas"

export type LoginFormValues = z.infer<typeof loginSchema>

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export type SeedAdmin = z.output<typeof seedAdminEnvSchema>

export type LoginResponse = z.infer<typeof loginResponseSchema>

// The persisted session is exactly what the login route returns.
export type AuthSession = LoginResponse

export type PersistedAuthState = {
  session: AuthSession | null
}

export type AuthState = {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

export type AuthFieldProps = {
  inputId: string
  label: string
  hint?: string
  error: string | undefined
  children: React.ReactNode
}

// `next` is where to return after signing in (e.g. /checkout).
export type AuthPageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export type RedirectTargetProps = {
  redirectTo: string
}

export type AuthPanelProps = {
  children: React.ReactNode
}

export type AuthCardProps = {
  title: string
  description: React.ReactNode
  children: React.ReactNode
}

export type SignedInCardProps = {
  session: AuthSession
}
