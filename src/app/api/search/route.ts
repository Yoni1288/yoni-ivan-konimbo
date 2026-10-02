import { searchProductsByTitle } from "@/features/products/repositories/products.repository"
import { searchQuerySchema } from "@/features/search/search.schemas"
import { withErrorHandling } from "@/shared/errors/with-error-handling"
import { parseSearchParams } from "@/shared/utils/parse-search-params"

export const GET = withErrorHandling(async (request: Request): Promise<Response> => {
  const query = parseSearchParams(request, searchQuerySchema)
  return Response.json({ products: await searchProductsByTitle(query) })
})
