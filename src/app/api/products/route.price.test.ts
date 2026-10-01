import { describe, expect, it } from "vitest"
import { getLowestPrice } from "@/features/products/utils/product-display"
import { createTestRequest } from "@/shared/testing/create-test-request"
import type { ProductsResponse } from "@/types/product"
import { GET } from "./route"

describe("GET /api/products?min_price&max_price", () => {
  it("returns only products whose lowest variant price is in the range", async () => {
    const response: Response = await GET(createTestRequest("/api/products?min_price=20000&max_price=40000&limit=100"), undefined)
    const body: ProductsResponse = await response.json()
    const amounts: number[] = body.products.map((product) => getLowestPrice(product)?.amount ?? 0)

    expect(response.status).toBe(200)
    expect(amounts.length).toBeGreaterThan(0)
    expect(amounts.every((amount) => amount >= 20000 && amount <= 40000)).toBe(true)
    expect(body.count).toBe(amounts.length)
  })

  it("rejects a minimum above the maximum", async () => {
    const response: Response = await GET(createTestRequest("/api/products?min_price=50000&max_price=10000"), undefined)

    expect(response.status).toBe(400)
  })
})
