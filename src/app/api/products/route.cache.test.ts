import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { redis } from "@/shared/cache/redis"
import { createTestRequest } from "@/shared/testing/create-test-request"
import type { ProductsResponse } from "@/types/product"
import { GET } from "./route"

// The cache key is the parsed query, with defaults applied and keys in schema order.
const DEFAULT_QUERY_KEY: string = JSON.stringify({ limit: 12, offset: 0, sort: "featured" })
const SEARCH_QUERY_KEY: string = JSON.stringify({ q: "lamp", tag: "home", limit: 12, offset: 0, sort: "featured" })
const CACHE_TTL_SECONDS: number = 5 * 60

const FAKE_CACHED_RESPONSE: ProductsResponse = { products: [], count: 999, limit: 12, offset: 0 }

beforeEach(async () => {
  await redis.del(DEFAULT_QUERY_KEY, SEARCH_QUERY_KEY)
})

afterAll(async () => {
  await redis.del(DEFAULT_QUERY_KEY, SEARCH_QUERY_KEY)
  await redis.quit()
})

describe("GET /api/products (Redis cache)", () => {
  it("stores a database result under the query key with a 5-minute TTL", async () => {
    const response: Response = await GET(createTestRequest("/api/products"), undefined)
    const body: ProductsResponse = await response.json()
    const cached: string | null = await redis.get(DEFAULT_QUERY_KEY)
    const ttlSeconds: number = await redis.ttl(DEFAULT_QUERY_KEY)

    expect(response.status).toBe(200)
    expect(cached && JSON.parse(cached)).toEqual(body)
    expect(ttlSeconds).toBeGreaterThan(0)
    expect(ttlSeconds).toBeLessThanOrEqual(CACHE_TTL_SECONDS)
  })

  it("returns the cached result without querying the database", async () => {
    await redis.set(DEFAULT_QUERY_KEY, JSON.stringify(FAKE_CACHED_RESPONSE), "EX", CACHE_TTL_SECONDS)

    const response: Response = await GET(createTestRequest("/api/products"), undefined)
    const body: ProductsResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(FAKE_CACHED_RESPONSE)
  })

  it("uses one key for the same params in a different order", async () => {
    await GET(createTestRequest("/api/products?tag=home&q=lamp"), undefined)
    await redis.set(SEARCH_QUERY_KEY, JSON.stringify(FAKE_CACHED_RESPONSE), "EX", CACHE_TTL_SECONDS)

    const response: Response = await GET(createTestRequest("/api/products?q=lamp&tag=home"), undefined)
    const body: ProductsResponse = await response.json()

    expect(body).toEqual(FAKE_CACHED_RESPONSE)
  })
})
