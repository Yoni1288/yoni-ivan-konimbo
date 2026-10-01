import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { apiPost } from "@/shared/api/api-client"
import { loginResponseSchema } from "../auth.schemas"
import type { LoginFormValues, LoginResponse } from "../auth.types"

export const useSignInMutation = (): UseMutationResult<LoginResponse, Error, LoginFormValues> => {
  return useMutation({ mutationFn: (credentials: LoginFormValues) => apiPost("/api/auth/login", credentials, loginResponseSchema) })
}
