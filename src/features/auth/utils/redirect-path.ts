import { redirectPathSchema } from "../auth.schemas"

export const DEFAULT_REDIRECT_PATH: string = "/products"

// Anything missing or unsafe (another host, an array of values) falls back to the default.
export const parseRedirectPath = (value: unknown): string => {
  const result = redirectPathSchema.safeParse(value)
  return result.success ? result.data : DEFAULT_REDIRECT_PATH
}

const withNextParam = (path: string, redirectTo: string): string => {
  if (redirectTo === DEFAULT_REDIRECT_PATH) {
    return path
  }

  return `${path}?next=${encodeURIComponent(redirectTo)}`
}

export const getLoginPath = (redirectTo: string): string => withNextParam("/login", redirectTo)

export const getRegisterPath = (redirectTo: string): string => withNextParam("/register", redirectTo)
