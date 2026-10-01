import { redis } from "@/shared/cache/redis"
import { categoryFilterSchema } from "../categories.schemas"
import type { CategoryFilter } from "../categories.types"

// Written by the /populat-collection-from-db command; it has no expiry and is rebuilt when the catalog changes.
export const CATEGORY_FILTER_KEY: string = "collection-filter"

export const findCategoryFilter = async (): Promise<CategoryFilter | null> => {
  const cachedValue: string | null = await redis.get(CATEGORY_FILTER_KEY)

  if (!cachedValue) {
    return null
  }

  return categoryFilterSchema.parse(JSON.parse(cachedValue))
}
