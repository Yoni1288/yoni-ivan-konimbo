import { orderNumberParamsSchema } from "@/features/checkout/checkout.schemas"
import type { OrderConfirmationRouteContext } from "@/features/checkout/checkout.types"
import { getOrderConfirmation } from "@/features/checkout/services/get-order-confirmation"
import { requireUserId } from "@/shared/auth/require-user-id"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseRouteParams } from "@/shared/utils/parse-route-params"

export const GET = withErrorHandling(async (request: Request, context: OrderConfirmationRouteContext): Promise<Response> => {
  const userId: number = await requireUserId(request)
  const { orderNumber } = await parseRouteParams(context.params, orderNumberParamsSchema)
  return Response.json(await getOrderConfirmation(userId, orderNumber))
})
