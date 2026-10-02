import { NextRequest } from "next/server"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { OrderConfirmation, OrderConfirmationRouteContext } from "@/features/checkout/checkout.types"
import { signAccessToken } from "@/shared/auth/access-token"
import { env } from "@/shared/config/env.server"
import { prisma } from "@/shared/db/prisma"
import { GET } from "./route"

const RUN_ID: string = Date.now().toString(36)
const OWNER_USERNAME: string = `owner_${RUN_ID}`
const OTHER_USERNAME: string = `other_${RUN_ID}`
const OWNER_EMAIL: string = `${OWNER_USERNAME}@example.com`
// Upper-case hex from the run id, so reruns don't collide on the unique order number.
const ORDER_NUMBER: string = `GS-${(Date.now() % 0xffffff).toString(16).toUpperCase().padStart(6, "0")}`

let ownerToken: string
let otherToken: string

const createUserWithToken = async (userName: string, email: string | null): Promise<string> => {
  const user = await prisma.user.create({ data: { userName, email, passwordHash: "unused" }, select: { id: true, userName: true } })
  return (await signAccessToken(user)).token
}

const requestOrder = (orderNumber: string, authToken?: string): Promise<Response> => {
  const headers: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {}
  const request: NextRequest = new NextRequest(new URL(`/api/order-confirmation/${orderNumber}`, env.APP_URL), { headers })
  const context: OrderConfirmationRouteContext = { params: Promise.resolve({ orderNumber }) }
  return GET(request, context)
}

beforeAll(async () => {
  ownerToken = await createUserWithToken(OWNER_USERNAME, OWNER_EMAIL)
  otherToken = await createUserWithToken(OTHER_USERNAME, null)
  await prisma.order.create({
    data: {
      orderNumber: ORDER_NUMBER,
      user: { connect: { userName: OWNER_USERNAME } },
      firstName: "Maya",
      lastName: "Rosen",
      address1: "12 Harbor Street",
      city: "Tel Aviv",
      postalCode: "6100000",
      country: "IL",
      subtotal: 59800,
      total: 59800,
      items: { create: [{ productId: "prod_01", variantId: "var_01a", title: "Classic Wireless Headphones", variantTitle: "Black", sku: "HP-BLK-01", unitPrice: 29900, quantity: 2 }] },
    },
  })
})

afterAll(async () => {
  await prisma.order.deleteMany({ where: { orderNumber: ORDER_NUMBER } })
  await prisma.user.deleteMany({ where: { userName: { in: [OWNER_USERNAME, OTHER_USERNAME] } } })
})

describe("GET /api/order-confirmation/:orderNumber", () => {
  it("returns the signed-in user's order", async () => {
    const response: Response = await requestOrder(ORDER_NUMBER, ownerToken)
    const body: OrderConfirmation = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      orderNumber: ORDER_NUMBER,
      firstName: "Maya",
      email: OWNER_EMAIL,
      shippingAddressLines: ["Maya Rosen", "12 Harbor Street", "Tel Aviv 6100000", "Israel"],
      items: [{ title: "Classic Wireless Headphones", variantTitle: "Black", quantity: 2 }],
      totalPaid: 59800,
      currencyCode: "ILS",
    })
  })

  it("returns 404 for another user's order", async () => {
    const response: Response = await requestOrder(ORDER_NUMBER, otherToken)

    expect(response.status).toBe(404)
  })

  it("rejects a request without a token", async () => {
    const response: Response = await requestOrder(ORDER_NUMBER)

    expect(response.status).toBe(401)
  })

  it("rejects a malformed order number", async () => {
    const response: Response = await requestOrder("not-an-order", ownerToken)

    expect(response.status).toBe(400)
  })
})
