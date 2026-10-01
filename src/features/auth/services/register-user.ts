import "server-only"
import { signAccessToken } from "@/shared/auth/access-token"
import { hashPassword } from "@/shared/auth/password"
import { HttpError } from "@/shared/errors/http-error"
import type { LoginResponse, RegisterCredentials } from "../auth.types"
import { createUser, isUserNameTaken, type PublicUser } from "../repositories/users.repository"

// Creates the account and signs it in, so the response has the same shape as sign-in.
// Two sign-ups racing for the same name still end in a 409: the unique index raises P2002, which the error handler maps.
export const registerUser = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
  const { username, password } = credentials

  if (await isUserNameTaken(username)) {
    throw new HttpError(409, "That username is already taken")
  }

  const passwordHash: string = await hashPassword(password)
  const user: PublicUser = await createUser(username, passwordHash)
  const { token, expiresAt } = await signAccessToken({ id: user.id, userName: user.userName })

  return { token, expiresAt, user }
}
