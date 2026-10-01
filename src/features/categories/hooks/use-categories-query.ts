import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { categoryKeys } from "../api/category-keys"
import { fetchCategories } from "../api/fetch-categories"
import type { CategoryFilter } from "../categories.types"

export const useCategoriesQuery = (): UseQueryResult<CategoryFilter> => {
  return useQuery({ queryKey: categoryKeys.all, queryFn: fetchCategories })
}
