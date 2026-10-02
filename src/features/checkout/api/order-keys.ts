export const orderKeys = {
  all: ["orders"] as const,
  confirmation: (orderNumber: string) => [...orderKeys.all, "confirmation", orderNumber] as const,
}
