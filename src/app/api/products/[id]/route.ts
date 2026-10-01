import { productIdParamsSchema } from "@/features/products/products.schemas"
import type { ProductRouteContext } from "@/features/products/products.types"
import { findProductById } from "@/features/products/repositories/products.repository"
import { HttpError } from "@/shared/errors/http-error"
import { withErrorHandling } from "@/shared/errors/with-error-handling"

export const GET = withErrorHandling(async (_request: Request, context: ProductRouteContext): Promise<Response> => {
  const { id } = productIdParamsSchema.parse(await context.params)
  const product = await findProductById(id)

  if (!product) {
    throw new HttpError(404, "Product not found")
  }

  return Response.json({ product })
})
