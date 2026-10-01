import { describe, expect, it } from "vitest"
import { createTestRequest } from "@/shared/testing/create-test-request"
import type { ProductsResponse } from "@/types/product"
import { GET } from "./route"

describe("GET /api/products", () => {
  it("returns a page of products from the database", async () => {
    const response: Response = await GET(createTestRequest("/api/products?limit=5"), undefined)
    const body: ProductsResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toHaveLength(5)
    expect(body.count).toBeGreaterThan(5)
    expect(body.limit).toBe(5)
    expect(body.offset).toBe(0)
  })

  it("returns only products in the requested collection", async () => {
    const response: Response = await GET(createTestRequest("/api/products?collection=audio"), undefined)
    const body: ProductsResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body.products.length).toBeGreaterThan(0)
    expect(body.products.every((product) => product.collection.handle === "audio")).toBe(true)
  })

  it("rejects an invalid limit", async () => {
    const response: Response = await GET(createTestRequest("/api/products?limit=abc"), undefined)

    expect(response.status).toBe(400)
  })
})
