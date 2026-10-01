import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import type { ProductResponse } from "@/types/product"
import { GET } from "./route"

function requestProduct(id: string): Promise<Response> {
  return GET(new NextRequest(`http://localhost/api/products/${id}`), { params: Promise.resolve({ id }) })
}

describe("GET /api/products/:id", () => {
  it("returns the product from the database", async () => {
    const response: Response = await requestProduct("prod_01")
    const body: ProductResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body.product.id).toBe("prod_01")
  })

  it("returns 404 for an unknown product", async () => {
    const response: Response = await requestProduct("prod_missing")

    expect(response.status).toBe(404)
  })
})
