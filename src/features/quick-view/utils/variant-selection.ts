import type { Product, ProductVariant } from "@/types/product"
import type { SelectedOptions } from "../quick-view.types"

// Variants carry no option values, only a title whose " - " parts follow the order of product.options.
// Titles can have extra parts with no option (prod_14: option Size, title "EU 42 - Black"), so only the first N parts count.
const getTitleParts = (variant: ProductVariant, optionCount: number): string[] => {
  return variant.title.split(" - ").slice(0, optionCount)
}

const toSelectedOptions = (product: Product, variant: ProductVariant): SelectedOptions => {
  const titleParts: string[] = getTitleParts(variant, product.options.length)
  return Object.fromEntries(product.options.map((option, index) => [option.title, titleParts[index]]))
}

const variantMatches = (product: Product, variant: ProductVariant, selectedOptions: SelectedOptions): boolean => {
  const titleParts: string[] = getTitleParts(variant, product.options.length)
  return product.options.every((option, index) => selectedOptions[option.title] === titleParts[index])
}

export const findVariant = (product: Product, selectedOptions: SelectedOptions): ProductVariant | null => {
  return product.variants.find((variant) => variantMatches(product, variant, selectedOptions)) ?? null
}

export const getInitialSelectedOptions = (product: Product): SelectedOptions => {
  const initialVariant: ProductVariant | undefined = product.variants.find((variant) => variant.inventory_quantity) ?? product.variants[0]

  if (!initialVariant) {
    return {}
  }

  return toSelectedOptions(product, initialVariant)
}

export const isOptionValueAvailable = (product: Product, selectedOptions: SelectedOptions, optionTitle: string, value: string): boolean => {
  const candidate: SelectedOptions = { ...selectedOptions, [optionTitle]: value }
  const variant: ProductVariant | null = findVariant(product, candidate)
  return Boolean(variant?.inventory_quantity)
}
