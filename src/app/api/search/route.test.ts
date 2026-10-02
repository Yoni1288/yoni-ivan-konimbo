import { describe, expect, it } from "vitest"
import type { SearchResponse } from "@/features/search/search.types"
import { createTestRequest } from "@/shared/testing/create-test-request"
import { GET } from "./route"

describe("GET /api/search", () => {
  it("returns products whose title contains the search text", async () => {
    const response: Response = await GET(createTestRequest("/api/search?q=HEADPH"), undefined)
    const body: SearchResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body.products.length).toBeGreaterThan(0)
    expect(body.products.every((product) => product.title.toLowerCase().includes("headph"))).toBe(true)
  })

  it("rejects search text shorter than 2 letters", async () => {
    const response: Response = await GET(createTestRequest("/api/search?q=a"), undefined)

    expect(response.status).toBe(400)
  })
})
