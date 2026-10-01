import type { Product, ProductImage, ProductOption, ProductVariant } from "@/types/product"

export type SelectedOptions = Record<string, string>

export type VariantSelection = {
  selectedOptions: SelectedOptions
  selectedVariant: ProductVariant | null
  selectOption: (optionTitle: string, value: string) => void
  isValueAvailable: (optionTitle: string, value: string) => boolean
}

export type QuickViewDialogProps = {
  product: Product
  onClose: () => void
}

export type ProductGalleryProps = {
  images: ProductImage[]
  title: string
}

export type OptionPickerProps = {
  option: ProductOption
  selectedValue: string | undefined
  isValueAvailable: (value: string) => boolean
  onSelect: (value: string) => void
}

export type QuantityStepperProps = {
  quantity: number
  max: number
  onChange: (quantity: number) => void
}

export type QuickViewDetailsProps = {
  product: Product
  titleId: string
}

export type OptionValueState = "selected" | "available" | "unavailable"

export type AddToCartBarProps = {
  variant: ProductVariant | null
}
