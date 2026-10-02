import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { AuthSession } from "@/features/auth/auth.types"
import { selectSession } from "@/features/auth/store/auth.selectors"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { apiGet } from "@/shared/api/api-client"
import { orderKeys } from "../api/order-keys"
import { orderConfirmationSchema } from "../checkout.schemas"
import type { OrderConfirmation } from "../checkout.types"

export const useOrderConfirmationQuery = (orderNumber: string | null): UseQueryResult<OrderConfirmation> => {
  const session: AuthSession | null = useAuthStore(selectSession)
  const token: string = session?.token ?? ""

  return useQuery({
    queryKey: orderKeys.confirmation(orderNumber ?? ""),
    queryFn: () => apiGet(`/api/order-confirmation/${orderNumber}`, orderConfirmationSchema, { Authorization: `Bearer ${token}` }),
    enabled: Boolean(token && orderNumber),
    retry: false,
  })
}
