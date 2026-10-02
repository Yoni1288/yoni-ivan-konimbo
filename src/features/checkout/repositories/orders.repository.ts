import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/shared/db/prisma"

const ORDER_CURRENCY_CODE: string = "ILS"

const checkoutVariantSelect = {
  id: true,
  productId: true,
  title: true,
  sku: true,
  inventoryQuantity: true,
  product: { select: { title: true } },
  prices: { where: { currencyCode: ORDER_CURRENCY_CODE }, select: { amount: true, currencyCode: true } },
} satisfies Prisma.VariantSelect

export type CheckoutVariant = Prisma.VariantGetPayload<{ select: typeof checkoutVariantSelect }>

export type NewOrder = Prisma.OrderCreateWithoutUserInput

export const findVariantsForCheckout = async (variantIds: string[]): Promise<CheckoutVariant[]> => {
  return prisma.variant.findMany({ where: { id: { in: variantIds } }, select: checkoutVariantSelect })
}

export const isEmailTakenByAnotherUser = async (email: string, userId: number): Promise<boolean> => {
  const user = await prisma.user.findFirst({ where: { email, id: { not: userId } }, select: { id: true } })
  return Boolean(user)
}

// One nested write, so the user's email and the order are saved together or not at all.
export const createOrderForUser = async (userId: number, email: string, order: NewOrder): Promise<void> => {
  await prisma.user.update({ where: { id: userId }, data: { email, orders: { create: order } }, select: { id: true } })
}

const orderConfirmationSelect = {
  orderNumber: true,
  firstName: true,
  lastName: true,
  address1: true,
  address2: true,
  city: true,
  postalCode: true,
  country: true,
  total: true,
  currencyCode: true,
  user: { select: { email: true } },
  items: { select: { title: true, variantTitle: true, quantity: true } },
} satisfies Prisma.OrderSelect

export type OrderConfirmationRow = Prisma.OrderGetPayload<{ select: typeof orderConfirmationSelect }>

// Filtered by user too, so one user can never read another user's order.
export const findOrderConfirmation = async (userId: number, orderNumber: string): Promise<OrderConfirmationRow | null> => {
  return prisma.order.findFirst({ where: { orderNumber, userId }, select: orderConfirmationSelect })
}
