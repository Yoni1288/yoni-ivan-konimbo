import "server-only"
import { signAccessToken } from "@/shared/auth/access-token"
import { verifyPassword } from "@/shared/auth/password"
import { HttpError } from "@/shared/errors/http-error"
import type { LoginFormValues, LoginResponse } from "../auth.types"
import { findUserCredentials, type UserCredentials } from "../repositories/users.repository"

// One message for an unknown user and a wrong password, so the response doesn't reveal which usernames exist.
const invalidCredentials = (): HttpError => new HttpError(401, "Invalid username or password")

export const signIn = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  const user: UserCredentials | null = await findUserCredentials(credentials.username)

  if (!user) {
    throw invalidCredentials()
  }

  const isPasswordValid: boolean = await verifyPassword(credentials.password, user.passwordHash)

  if (!isPasswordValid) {
    throw invalidCredentials()
  }

  const { id, userName, email } = user
  const { token, expiresAt } = await signAccessToken({ id, userName })

  return { token, expiresAt, user: { id, userName, email } }
}
