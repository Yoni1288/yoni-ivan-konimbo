import { redis } from "@/shared/cache/redis"
import { CATEGORY_FILTER_KEY } from "../categories.constants"
import { categoryFilterSchema } from "../categories.schemas"
import type { CategoryFilter } from "../categories.types"

export const findCategoryFilter = async (): Promise<CategoryFilter | null> => {
  const cachedValue: string | null = await redis.get(CATEGORY_FILTER_KEY)

  if (!cachedValue) {
    return null
  }

  return categoryFilterSchema.parse(JSON.parse(cachedValue))
}
