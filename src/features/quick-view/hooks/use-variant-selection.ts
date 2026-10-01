import { useMemo, useState } from "react"
import type { Product, ProductVariant } from "@/types/product"
import type { SelectedOptions, VariantSelection } from "../quick-view.types"
import { findVariant, getInitialSelectedOptions, isOptionValueAvailable } from "../utils/variant-selection"

export const useVariantSelection = (product: Product): VariantSelection => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => getInitialSelectedOptions(product))
  const selectedVariant: ProductVariant | null = useMemo(() => findVariant(product, selectedOptions), [product, selectedOptions])

  const selectOption = (optionTitle: string, value: string): void => {
    setSelectedOptions((current) => ({ ...current, [optionTitle]: value }))
  }

  const isValueAvailable = (optionTitle: string, value: string): boolean => {
    return isOptionValueAvailable(product, selectedOptions, optionTitle, value)
  }

  return { selectedOptions, selectedVariant, selectOption, isValueAvailable }
}
