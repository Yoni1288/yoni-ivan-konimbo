import { registerCredentialsSchema } from "@/features/auth/auth.schemas"
import { registerUser } from "@/features/auth/services/register-user"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseJsonBody } from "@/shared/utils/parse-json-body"

export const POST = withErrorHandling(async (request: Request): Promise<Response> => {
  const credentials = await parseJsonBody(request, registerCredentialsSchema)
  return Response.json(await registerUser(credentials), { status: 201 })
})
