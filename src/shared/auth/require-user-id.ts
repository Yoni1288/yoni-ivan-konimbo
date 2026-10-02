import "server-only"
import { HttpError } from "@/shared/errors/http-error"
import { verifyAccessToken } from "./access-token"

const BEARER_PREFIX: string = "Bearer "

export const requireUserId = async (request: Request): Promise<number> => {
  const authorization: string | null = request.headers.get("authorization")

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    throw new HttpError(401, "Sign in to continue")
  }

  return verifyAccessToken(authorization.slice(BEARER_PREFIX.length))
}
