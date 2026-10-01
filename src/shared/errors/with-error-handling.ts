import type { ErrorResponseBody } from "./errors.types"
import { HttpError } from "./http-error"
import { toHttpErrorFromPrisma } from "./prisma-errors"
import { sendError } from "./send-error"

type RouteHandler<TContext> = (request: Request, context: TContext) => Promise<Response>

function errorResponse(statusCode: number, message: string): Response {
  const body: ErrorResponseBody = { statusCode, message }
  return Response.json(body, { status: statusCode })
}

function toKnownHttpError(error: unknown): HttpError | null {
  if (error instanceof HttpError) {
    return error
  }

  return toHttpErrorFromPrisma(error)
}

export function withErrorHandling<TContext>(handler: RouteHandler<TContext>): RouteHandler<TContext> {
  return async (request: Request, context: TContext): Promise<Response> => {
    try {
      return await handler(request, context)
    } catch (error) {
      sendError({ error })

      const knownError: HttpError | null = toKnownHttpError(error)

      if (knownError) {
        return errorResponse(knownError.statusCode, knownError.message)
      }

      return errorResponse(500, "Internal server error")
    }
  }
}
