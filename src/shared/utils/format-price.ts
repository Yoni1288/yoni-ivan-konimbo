// Mock prices are stored in minor units (agorot), so 29900 means 299.00.
export const formatPrice = (amountMinor: number, currencyCode: string): string => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amountMinor / 100)
}
