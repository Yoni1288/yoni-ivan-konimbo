import "server-only"
import { jwtVerify, SignJWT } from "jose"
import { env } from "@/shared/config/env.server"
import { HttpError } from "@/shared/errors/http-error"
import type { AccessToken, AccessTokenUser } from "./auth-token.types"

export const ACCESS_TOKEN_TTL_SECONDS: number = 60 * 60

const signingKey: Uint8Array = new TextEncoder().encode(env.JWT_SECRET)

export const signAccessToken = async (user: AccessTokenUser): Promise<AccessToken> => {
  const issuedAt: number = Math.floor(Date.now() / 1000)
  const expiresAtSeconds: number = issuedAt + ACCESS_TOKEN_TTL_SECONDS

  // JWT requires `sub` to be a string, so the numeric user id is stored as text.
  const token: string = await new SignJWT({ name: user.userName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAtSeconds)
    .sign(signingKey)

  return { token, expiresAt: new Date(expiresAtSeconds * 1000).toISOString() }
}

// Returns the user id from a valid, unexpired token. Any problem with the token is the same 401 for the client.
export const verifyAccessToken = async (token: string): Promise<number> => {
  const { payload } = await jwtVerify(token, signingKey, { algorithms: ["HS256"] }).catch(() => {
    throw new HttpError(401, "Sign in to continue")
  })
  const userId: number = Number(payload.sub)

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpError(401, "Sign in to continue")
  }

  return userId
}
