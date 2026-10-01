import { Prisma } from "@/generated/prisma/client"
import { HttpError } from "./http-error"

const KNOWN_PRISMA_ERRORS: Record<string, HttpError> = {
  P2025: new HttpError(404, "Not found"),
  P2002: new HttpError(409, "Already exists"),
}

export function toHttpErrorFromPrisma(error: unknown): HttpError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null
  }

  return KNOWN_PRISMA_ERRORS[error.code] ?? null
}
