import { checkoutRequestSchema } from "@/features/checkout/checkout.schemas"
import { placeOrder } from "@/features/checkout/services/place-order"
import { requireUserId } from "@/shared/auth/require-user-id"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseJsonBody } from "@/shared/utils/parse-json-body"

export const POST = withErrorHandling(async (request: Request): Promise<Response> => {
  const userId: number = await requireUserId(request)
  const checkout = await parseJsonBody(request, checkoutRequestSchema)
  return Response.json(await placeOrder(userId, checkout), { status: 201 })
})
