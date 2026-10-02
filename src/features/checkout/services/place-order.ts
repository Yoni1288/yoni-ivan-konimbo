import "server-only"
import { randomBytes } from "node:crypto"
import { parsePhoneNumber } from "libphonenumber-js"
import type { Prisma } from "@/generated/prisma/client"
import { HttpError } from "@/shared/errors/http-error"
import type { CheckoutItem, CheckoutRequest, CheckoutResponse } from "../checkout.types"
import { type CheckoutVariant, createOrderForUser, findVariantsForCheckout, isEmailTakenByAnotherUser, type NewOrder } from "../repositories/orders.repository"

const ORDER_NUMBER_PREFIX: string = "GS-"

const generateOrderNumber = (): string => {
  return `${ORDER_NUMBER_PREFIX}${randomBytes(3).toString("hex").toUpperCase()}`
}

const findVariantOrThrow = (variants: CheckoutVariant[], variantId: string): CheckoutVariant => {
  const variant: CheckoutVariant | undefined = variants.find((candidate) => candidate.id === variantId)

  if (!variant?.prices.length) {
    throw new HttpError(400, "Some items are no longer available")
  }

  return variant
}

// Prices come from the database, never from the client, so a tampered cart can't change what is charged.
const toOrderItem = (item: CheckoutItem, variants: CheckoutVariant[]): Prisma.OrderItemCreateWithoutOrderInput => {
  const { id, productId, title, sku, inventoryQuantity, product, prices } = findVariantOrThrow(variants, item.variantId)

  if (item.quantity > inventoryQuantity) {
    throw new HttpError(409, "Some items are out of stock")
  }

  return { productId, variantId: id, title: product.title, variantTitle: title, sku, unitPrice: prices[0].amount, quantity: item.quantity }
}

const toOrder = (checkout: CheckoutRequest, items: Prisma.OrderItemCreateWithoutOrderInput[], currencyCode: string): NewOrder => {
  const { firstName, lastName, address1, address2, city, postalCode, country, phone } = checkout
  const subtotal: number = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

  return {
    orderNumber: generateOrderNumber(),
    firstName,
    lastName,
    address1,
    address2: address2 || null,
    city,
    postalCode,
    country,
    phone: phone ? parsePhoneNumber(phone, country).number : null,
    currencyCode,
    subtotal,
    total: subtotal,
    items: { create: items },
  }
}

// Stock is checked but not decremented, so the reseedable catalog stays unchanged (see DECISIONS.md).
export const placeOrder = async (userId: number, checkout: CheckoutRequest): Promise<CheckoutResponse> => {
  const { email, items: checkoutItems } = checkout

  if (await isEmailTakenByAnotherUser(email, userId)) {
    throw new HttpError(409, "That email is used by another account")
  }

  const variants: CheckoutVariant[] = await findVariantsForCheckout(checkoutItems.map((item) => item.variantId))
  const items: Prisma.OrderItemCreateWithoutOrderInput[] = checkoutItems.map((item) => toOrderItem(item, variants))
  const currencyCode: string = variants[0].prices[0].currencyCode
  const order: NewOrder = toOrder(checkout, items, currencyCode)

  await createOrderForUser(userId, email, order)

  return { orderNumber: order.orderNumber }
}
