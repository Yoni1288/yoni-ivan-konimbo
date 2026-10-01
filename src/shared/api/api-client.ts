import type { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

export async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response: Response = await fetch(path)

  if (!response.ok) {
    throw new HttpError(response.status, `Request to ${path} failed`)
  }

  const body: unknown = await response.json()
  return schema.parse(body)
}
