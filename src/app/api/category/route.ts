import { findCategoryFilter } from "@/features/categories/repositories/category-filter.repository"
import { HttpError } from "@/shared/errors/http-error"
import { withErrorHandling } from "@/shared/errors/with-error-handling"

export const GET = withErrorHandling(async (): Promise<Response> => {
  const categoryFilter = await findCategoryFilter()

  if (!categoryFilter) {
    throw new HttpError(404, "Categories not found")
  }

  return Response.json(categoryFilter)
})
