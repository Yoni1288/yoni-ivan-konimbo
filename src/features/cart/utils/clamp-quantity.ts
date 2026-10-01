export const clampQuantity = (quantity: number, inventoryQuantity: number): number => {
  return Math.min(Math.max(quantity, 1), inventoryQuantity)
}
