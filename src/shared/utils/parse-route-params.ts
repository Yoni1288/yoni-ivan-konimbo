import { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

// Like parseSearchParams: a malformed path segment is a 400, not an unknown error.
export const parseRouteParams = async <TSchema extends z.ZodType>(params: Promise<unknown>, schema: TSchema): Promise<z.infer<TSchema>> => {
  const result = schema.safeParse(await params)

  if (!result.success) {
    throw new HttpError(400, z.prettifyError(result.error))
  }

  return result.data
}
