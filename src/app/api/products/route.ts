import { productListQuerySchema } from "@/features/products/products.schemas"
import { findProducts } from "@/features/products/repositories/products.repository"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseSearchParams } from "@/shared/utils/parse-search-params"

export const GET = withErrorHandling(async (request: Request): Promise<Response> => {
  const query = parseSearchParams(request, productListQuerySchema)
  return Response.json(await findProducts(query))
})
