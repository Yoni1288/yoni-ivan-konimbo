import { NextRequest } from "next/server"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { CheckoutRequest } from "@/features/checkout/checkout.types"
import { signAccessToken } from "@/shared/auth/access-token"
import { env } from "@/shared/config/env.server"
import { prisma } from "@/shared/db/prisma"
import { POST } from "./route"

// A user made for this file, so saving the checkout email never touches the seeded admin.
const TEST_USERNAME: string = `checkout_${Date.now().toString(36)}`
const TEST_EMAIL: string = `${TEST_USERNAME}@example.com`

const VALID_CHECKOUT: CheckoutRequest = {
  email: TEST_EMAIL,
  firstName: "Maya",
  lastName: "Rosen",
  address1: "12 Harbor Street",
  address2: "",
  city: "Tel Aviv",
  postalCode: "6100000",
  country: "IL",
  phone: "050-123-4567",
  // Seeded variant "HP-BLK-01": 29900 agorot, 25 in stock.
  items: [{ variantId: "var_01a", quantity: 2 }],
}

let userId: number
let token: string

const createCheckoutRequest = (body: unknown, authToken?: string): NextRequest => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  return new NextRequest(new URL("/api/checkout", env.APP_URL), { method: "POST", body: JSON.stringify(body), headers })
}

beforeAll(async () => {
  const user = await prisma.user.create({ data: { userName: TEST_USERNAME, passwordHash: "unused" }, select: { id: true, userName: true } })
  userId = user.id
  token = (await signAccessToken(user)).token
})

afterAll(async () => {
  await prisma.order.deleteMany({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })
})

describe("POST /api/checkout", () => {
  it("creates the order with database prices and saves the email on the user", async () => {
    const response: Response = await POST(createCheckoutRequest(VALID_CHECKOUT, token), undefined)
    const body: { orderNumber: string } = await response.json()

    expect(response.status).toBe(201)
    expect(body.orderNumber).toMatch(/^GS-[0-9A-F]{6}$/)

    const order = await prisma.order.findUnique({ where: { orderNumber: body.orderNumber }, select: { userId: true, total: true, phone: true, items: { select: { sku: true, quantity: true } } } })
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })

    expect(order).toEqual({ userId, total: 59800, phone: "+972501234567", items: [{ sku: "HP-BLK-01", quantity: 2 }] })
    expect(user?.email).toBe(TEST_EMAIL)
  })

  it("rejects a request without a token", async () => {
    const response: Response = await POST(createCheckoutRequest(VALID_CHECKOUT), undefined)

    expect(response.status).toBe(401)
  })

  it("rejects an invalid email", async () => {
    const response: Response = await POST(createCheckoutRequest({ ...VALID_CHECKOUT, email: "not-an-email" }, token), undefined)

    expect(response.status).toBe(400)
  })

  it("rejects an invalid phone number", async () => {
    const response: Response = await POST(createCheckoutRequest({ ...VALID_CHECKOUT, phone: "123" }, token), undefined)

    expect(response.status).toBe(400)
  })

  it("rejects a quantity above the stock", async () => {
    const response: Response = await POST(createCheckoutRequest({ ...VALID_CHECKOUT, items: [{ variantId: "var_01a", quantity: 999 }] }, token), undefined)

    expect(response.status).toBe(409)
  })
})
