"use client"

import { useState } from "react"
import { formatPrice } from "@/shared/utils/format-price"
import type { Price } from "@/types/product"
import type { AddToCartBarProps } from "../quick-view.types"
import { QuantityStepper } from "./quantity-stepper"

const getButtonLabel = (price: Price | undefined, quantity: number, isSoldOut: boolean): string => {
  if (isSoldOut || !price) {
    return "Sold out"
  }

  return `Add to cart · ${formatPrice(price.amount * quantity, price.currency_code)}`
}

// Rendered with key={variant.id}, so the quantity resets whenever the selected variant changes.
// The cart store doesn't exist yet, so "Add to cart" is a placeholder.
export const AddToCartBar = ({ variant }: AddToCartBarProps): React.JSX.Element => {
  const [quantity, setQuantity] = useState<number>(1)
  const inventory: number = variant?.inventory_quantity ?? 0
  const price: Price | undefined = variant?.prices[0]
  const isSoldOut: boolean = !inventory

  return (
    <div className="flex gap-3">
      <QuantityStepper quantity={quantity} max={Math.max(inventory, 1)} onChange={setQuantity} />
      <button
        type="button"
        disabled={isSoldOut}
        className="h-14 flex-1 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {getButtonLabel(price, quantity, isSoldOut)}
      </button>
    </div>
  )
}
