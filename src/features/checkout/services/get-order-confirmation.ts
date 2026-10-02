import "server-only"
import { HttpError } from "@/shared/errors/http-error"
import { COUNTRY_CODES, COUNTRY_NAMES } from "../checkout.constants"
import type { OrderConfirmation } from "../checkout.types"
import { findOrderConfirmation, type OrderConfirmationRow } from "../repositories/orders.repository"

const isKnownCountryCode = (code: string): code is (typeof COUNTRY_CODES)[number] => {
  return COUNTRY_CODES.some((knownCode) => knownCode === code)
}

const toShippingAddressLines = (order: OrderConfirmationRow): string[] => {
  const { firstName, lastName, address1, address2, city, postalCode, country } = order
  const countryName: string = isKnownCountryCode(country) ? COUNTRY_NAMES[country] : country
  const lines: (string | null)[] = [`${firstName} ${lastName}`, address1, address2, `${city} ${postalCode}`, countryName]

  return lines.filter((line): line is string => Boolean(line))
}

export const getOrderConfirmation = async (userId: number, orderNumber: string): Promise<OrderConfirmation> => {
  const order: OrderConfirmationRow | null = await findOrderConfirmation(userId, orderNumber)

  if (!order) {
    throw new HttpError(404, "Order not found")
  }

  const { firstName, user, items, total, currencyCode } = order
  return { orderNumber: order.orderNumber, firstName, email: user.email, shippingAddressLines: toShippingAddressLines(order), items, totalPaid: total, currencyCode }
}
