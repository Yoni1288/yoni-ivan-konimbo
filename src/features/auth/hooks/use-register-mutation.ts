import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { apiPost } from "@/shared/api/api-client"
import { loginResponseSchema } from "../auth.schemas"
import type { LoginResponse, RegisterCredentials } from "../auth.types"

export const useRegisterMutation = (): UseMutationResult<LoginResponse, Error, RegisterCredentials> => {
  return useMutation({ mutationFn: (credentials: RegisterCredentials) => apiPost("/api/auth/register", credentials, loginResponseSchema) })
}
