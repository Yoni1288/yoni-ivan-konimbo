import { useMutation, type UseMutationResult } from "@tanstack/react-query"
import { selectSession } from "@/features/auth/store/auth.selectors"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type { AuthSession } from "@/features/auth/auth.types"
import { apiPost } from "@/shared/api/api-client"
import { checkoutResponseSchema } from "../checkout.schemas"
import type { CheckoutRequest, CheckoutResponse } from "../checkout.types"

export const usePlaceOrderMutation = (): UseMutationResult<CheckoutResponse, Error, CheckoutRequest> => {
  const session: AuthSession | null = useAuthStore(selectSession)

  return useMutation({
    mutationFn: (checkout: CheckoutRequest) => apiPost("/api/checkout", checkout, checkoutResponseSchema, { Authorization: `Bearer ${session?.token ?? ""}` }),
  })
}
