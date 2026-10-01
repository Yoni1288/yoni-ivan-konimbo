import { describe, expect, it } from "vitest"
import { getLowestPrice } from "@/features/products/utils/product-display"
import { createTestRequest } from "@/shared/testing/create-test-request"
import type { ProductsResponse } from "@/types/product"
import { GET } from "./route"

const getLowestAmounts = (body: ProductsResponse): number[] => {
  return body.products.map((product) => getLowestPrice(product)?.amount ?? 0)
}

describe("GET /api/products?sort", () => {
  it("sorts by each product's lowest variant price, low to high", async () => {
    const response: Response = await GET(createTestRequest("/api/products?sort=price_asc&limit=100"), undefined)
    const body: ProductsResponse = await response.json()
    const amounts: number[] = getLowestAmounts(body)

    expect(response.status).toBe(200)
    expect(amounts).toEqual(amounts.toSorted((a, b) => a - b))
  })

  it("sorts by each product's lowest variant price, high to low", async () => {
    const response: Response = await GET(createTestRequest("/api/products?sort=price_desc&limit=100"), undefined)
    const body: ProductsResponse = await response.json()
    const amounts: number[] = getLowestAmounts(body)

    expect(response.status).toBe(200)
    expect(amounts).toEqual(amounts.toSorted((a, b) => b - a))
  })

  it("sorts newest first", async () => {
    const response: Response = await GET(createTestRequest("/api/products?sort=newest&limit=100"), undefined)
    const body: ProductsResponse = await response.json()
    const createdAt: string[] = body.products.map((product) => product.created_at)

    expect(response.status).toBe(200)
    expect(createdAt).toEqual(createdAt.toSorted().reverse())
  })

  it("rejects an unknown sort", async () => {
    const response: Response = await GET(createTestRequest("/api/products?sort=cheapest"), undefined)

    expect(response.status).toBe(400)
  })
})
