"use client"

import { useState } from "react"
import type { NewCartLine } from "@/features/cart/cart.types"
import { useCartStore } from "@/features/cart/store/cart.store"
import { formatPrice } from "@/shared/utils/format-price"
import type { Price } from "@/types/product"
import type { AddToCartBarProps } from "../quick-view.types"
import { toCartLine } from "../utils/to-cart-line"
import { QuantityStepper } from "./quantity-stepper"

const getButtonLabel = (price: Price | undefined, quantity: number, isSoldOut: boolean): string => {
  if (isSoldOut || !price) {
    return "Sold out"
  }

  return `Add to cart · ${formatPrice(price.amount * quantity, price.currency_code)}`
}

// Rendered with key={variant.id}, so the quantity resets whenever the selected variant changes.
export const AddToCartBar = ({ product, variant, onAdded }: AddToCartBarProps): React.JSX.Element => {
  const [quantity, setQuantity] = useState<number>(1)
  const addItem: (line: NewCartLine, quantity: number) => void = useCartStore((state) => state.addItem)
  const inventory: number = variant?.inventory_quantity ?? 0
  const price: Price | undefined = variant?.prices[0]
  const isSoldOut: boolean = !inventory

  const handleAddToCart = (): void => {
    if (!variant || !price) return
    addItem(toCartLine(product, variant, price), quantity)
    onAdded()
  }

  return (
    <div className="flex gap-3">
      <QuantityStepper quantity={quantity} max={Math.max(inventory, 1)} onChange={setQuantity} />
      <button
        type="button"
        disabled={isSoldOut || !price}
        onClick={handleAddToCart}
        className="h-14 flex-1 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {getButtonLabel(price, quantity, isSoldOut)}
      </button>
    </div>
  )
}
