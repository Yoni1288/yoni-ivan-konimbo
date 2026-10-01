import type { CartLine } from "../cart.types"

export const getLineTotal = (line: CartLine): number => {
  return line.unitPrice * line.quantity
}

export const getSubtotal = (lines: CartLine[]): number => {
  return lines.reduce((total, line) => total + getLineTotal(line), 0)
}

export const getItemCount = (lines: CartLine[]): number => {
  return lines.reduce((count, line) => count + line.quantity, 0)
}
