import { apiGet } from "@/shared/api/api-client"
import { categoryFilterSchema } from "../categories.schemas"
import type { CategoryFilter } from "../categories.types"

export const fetchCategories = (): Promise<CategoryFilter> => {
  return apiGet("/api/category", categoryFilterSchema)
}
