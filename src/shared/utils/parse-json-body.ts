import { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

export const parseJsonBody = async <TSchema extends z.ZodType>(request: Request, schema: TSchema): Promise<z.infer<TSchema>> => {
  const body: unknown = await request.json().catch(() => {
    throw new HttpError(400, "Request body must be valid JSON")
  })
  const result = schema.safeParse(body)

  if (!result.success) {
    throw new HttpError(400, z.prettifyError(result.error))
  }

  return result.data
}
