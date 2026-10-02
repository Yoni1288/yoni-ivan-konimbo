export const CHECKOUT_PATH: string = "/checkout"

export const ORDER_CONFIRMATION_PATH: string = "/order-confirmation"

export const getOrderConfirmationPath = (orderNumber: string): string => {
  return `${ORDER_CONFIRMATION_PATH}?${new URLSearchParams({ order: orderNumber }).toString()}`
}

export const COUNTRY_CODES = ["IL", "US", "GB", "DE", "FR"] as const

export const COUNTRY_NAMES: Record<(typeof COUNTRY_CODES)[number], string> = {
  IL: "Israel",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
}

export const DEFAULT_COUNTRY_CODE: (typeof COUNTRY_CODES)[number] = "IL"
