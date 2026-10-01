import { z } from "zod"
import { HttpError } from "@/shared/errors/http-error"

export const parseSearchParams = <TSchema extends z.ZodType>(request: Request, schema: TSchema): z.infer<TSchema> => {
  const searchParams: URLSearchParams = new URL(request.url).searchParams
  // An empty param such as `?q=` means "no filter", not an invalid value.
  const nonEmptyParams: [string, string][] = [...searchParams.entries()].filter(([, value]) => value !== "")
  const result = schema.safeParse(Object.fromEntries(nonEmptyParams))

  if (!result.success) {
    throw new HttpError(400, z.prettifyError(result.error))
  }

  return result.data
}
