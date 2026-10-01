import type { Price, Product } from "@/types/product"
import type { ColorSwatch, StockStatus } from "../products.types"

const LOW_STOCK_THRESHOLD: number = 10

const SWATCH_OPTION_TITLES: string[] = ["Color", "Finish"]

const SWATCH_COLORS: Record<string, string> = {
  Black: "#1f1f1f",
  "Matte Black": "#2a2a2a",
  White: "#f2f1ed",
  Cream: "#ece3cf",
  Gray: "#9a9a96",
  "Space Gray": "#6e6e70",
  Silver: "#c9c9c7",
  Gunmetal: "#4a4d52",
  Charcoal: "#3a3a3a",
  Navy: "#27324a",
  "Navy Blue": "#27324a",
  "Midnight Blue": "#1f2940",
  Teal: "#2f6f6d",
  Red: "#b5452e",
  "Olive Green": "#6b6b3f",
  "Forest Green": "#2f4a36",
  Sage: "#9aa58c",
  Lavender: "#b8aecb",
  "Dusty Rose": "#c9a0a0",
  Brown: "#6b4f3a",
  Oatmeal: "#d8cdb8",
  Slate: "#5d6570",
  Natural: "#c8b28c",
  "Light Wood": "#c9a878",
  "Dark Wood": "#5c3f2a",
}

export function getLowestPrice(product: Product): Price | null {
  const prices: Price[] = product.variants.flatMap((variant) => variant.prices.slice(0, 1))

  if (!prices.length) {
    return null
  }

  return prices.reduce((lowest, price) => (price.amount < lowest.amount ? price : lowest))
}

export function getStockStatus(product: Product): StockStatus {
  const totalInventory: number = product.variants.reduce((total, variant) => total + variant.inventory_quantity, 0)

  if (!totalInventory) {
    return "sold-out"
  }

  if (totalInventory <= LOW_STOCK_THRESHOLD) {
    return "low-stock"
  }

  return "in-stock"
}

export function getColorSwatches(product: Product): ColorSwatch[] {
  const swatchOption = product.options.find((option) => SWATCH_OPTION_TITLES.includes(option.title))

  if (!swatchOption) {
    return []
  }

  return swatchOption.values.filter((value) => value in SWATCH_COLORS).map((value) => ({ name: value, hex: SWATCH_COLORS[value] }))
}
