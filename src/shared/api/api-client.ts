import { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

const errorResponseSchema = z.object({ statusCode: z.number(), message: z.string() })

// Route handlers only ever send safe messages (see withErrorHandling), so the client may show them.
const readErrorMessage = async (response: Response, path: string): Promise<string> => {
  const fallbackMessage: string = `Request to ${path} failed`

  if (!response.headers.get("content-type")?.includes("application/json")) {
    return fallbackMessage
  }

  const result = errorResponseSchema.safeParse(await response.json())
  return result.success ? result.data.message : fallbackMessage
}

const parseResponse = async <T>(response: Response, path: string, schema: z.ZodType<T>): Promise<T> => {
  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response, path))
  }

  const body: unknown = await response.json()
  return schema.parse(body)
}

export const apiGet = async <T>(path: string, schema: z.ZodType<T>, headers: Record<string, string> = {}): Promise<T> => {
  const response: Response = await fetch(path, { headers })
  return parseResponse(response, path, schema)
}

export const apiPost = async <T>(path: string, body: unknown, schema: z.ZodType<T>, headers: Record<string, string> = {}): Promise<T> => {
  const response: Response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) })
  return parseResponse(response, path, schema)
}
