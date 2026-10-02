import { afterAll, describe, expect, it } from "vitest"
import { CATEGORY_FILTER_KEY } from "@/features/categories/categories.constants"
import type { CategoryFilter } from "@/features/categories/categories.types"
import { redis } from "@/shared/cache/redis"
import { createTestRequest } from "@/shared/testing/create-test-request"
import { GET } from "./route"

const categoryFilter: CategoryFilter = {
  total: 3,
  collections: [
    { id: "col_01", title: "Audio", handle: "audio", count: 2 },
    { id: "col_02", title: "Home", handle: "home", count: 1 },
  ],
}

const requestCategories = (): Promise<Response> => {
  return GET(createTestRequest("/api/category"), undefined)
}

describe("GET /api/category", () => {
  afterAll(async () => {
    await redis.del(CATEGORY_FILTER_KEY)
    await redis.quit()
  })

  it("returns the category filter stored in Redis", async () => {
    await redis.set(CATEGORY_FILTER_KEY, JSON.stringify(categoryFilter))

    const response: Response = await requestCategories()
    const body: CategoryFilter = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(categoryFilter)
  })

  it("returns 404 when the key is missing", async () => {
    await redis.del(CATEGORY_FILTER_KEY)

    const response: Response = await requestCategories()

    expect(response.status).toBe(404)
  })
})
