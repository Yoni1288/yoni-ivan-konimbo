import type { Price, Product } from "@/types/product"
import type { ColorSwatch, StockStatus } from "../products.types"

const LOW_STOCK_THRESHOLD: number = 10

const SWATCH_OPTION_TITLES: string[] = ["Color", "Finish"]

// Full class names so Tailwind can find them; the colors are theme tokens in globals.css.
const SWATCH_CLASSES: Record<string, string> = {
  Black: "bg-swatch-black",
  "Matte Black": "bg-swatch-matte-black",
  White: "bg-swatch-white",
  Cream: "bg-swatch-cream",
  Gray: "bg-swatch-gray",
  "Space Gray": "bg-swatch-space-gray",
  Silver: "bg-swatch-silver",
  Gunmetal: "bg-swatch-gunmetal",
  Charcoal: "bg-swatch-charcoal",
  Navy: "bg-swatch-navy",
  "Navy Blue": "bg-swatch-navy",
  "Midnight Blue": "bg-swatch-midnight-blue",
  Teal: "bg-swatch-teal",
  Red: "bg-swatch-red",
  "Olive Green": "bg-swatch-olive-green",
  "Forest Green": "bg-swatch-forest-green",
  Sage: "bg-swatch-sage",
  Lavender: "bg-swatch-lavender",
  "Dusty Rose": "bg-swatch-dusty-rose",
  Brown: "bg-swatch-brown",
  Oatmeal: "bg-swatch-oatmeal",
  Slate: "bg-swatch-slate",
  Natural: "bg-swatch-natural",
  "Light Wood": "bg-swatch-light-wood",
  "Dark Wood": "bg-swatch-dark-wood",
}

export const getLowestPrice = (product: Product): Price | null => {
  const prices: Price[] = product.variants.flatMap((variant) => variant.prices.slice(0, 1))

  if (!prices.length) {
    return null
  }

  return prices.reduce((lowest, price) => (price.amount < lowest.amount ? price : lowest))
}

export const getStockStatusForQuantity = (quantity: number): StockStatus => {
  if (!quantity) {
    return "sold-out"
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return "low-stock"
  }

  return "in-stock"
}

export const getStockStatus = (product: Product): StockStatus => {
  const totalInventory: number = product.variants.reduce((total, variant) => total + variant.inventory_quantity, 0)
  return getStockStatusForQuantity(totalInventory)
}

export const isSwatchOption = (optionTitle: string): boolean => {
  return SWATCH_OPTION_TITLES.includes(optionTitle)
}

export const getSwatchClass = (value: string): string | null => {
  return SWATCH_CLASSES[value] ?? null
}

export const getColorSwatches = (product: Product): ColorSwatch[] => {
  const swatchOption = product.options.find((option) => isSwatchOption(option.title))

  if (!swatchOption) {
    return []
  }

  return swatchOption.values.filter((value) => value in SWATCH_CLASSES).map((value) => ({ name: value, className: SWATCH_CLASSES[value] }))
}
