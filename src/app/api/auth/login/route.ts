import { loginSchema } from "@/features/auth/auth.schemas"
import { signIn } from "@/features/auth/services/sign-in"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseJsonBody } from "@/shared/utils/parse-json-body"

export const POST = withErrorHandling(async (request: Request): Promise<Response> => {
  const credentials = await parseJsonBody(request, loginSchema)
  return Response.json(await signIn(credentials))
})
