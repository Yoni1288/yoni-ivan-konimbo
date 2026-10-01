import type { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

const parseResponse = async <T>(response: Response, path: string, schema: z.ZodType<T>): Promise<T> => {
  if (!response.ok) {
    throw new HttpError(response.status, `Request to ${path} failed`)
  }

  const body: unknown = await response.json()
  return schema.parse(body)
}

export const apiGet = async <T>(path: string, schema: z.ZodType<T>): Promise<T> => {
  const response: Response = await fetch(path)
  return parseResponse(response, path, schema)
}

export const apiPost = async <T>(path: string, body: unknown, schema: z.ZodType<T>): Promise<T> => {
  const response: Response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  return parseResponse(response, path, schema)
}
