import type { CartLine } from "@/features/cart/cart.types"

export type CheckoutSectionProps = {
  isCartReady: boolean
}

export type TextFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  label: string
  hint?: string
}

export type SummaryLineProps = {
  line: CartLine
  index: number
}
