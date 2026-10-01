"use client"

import { formatPrice } from "@/shared/utils/format-price"
import type { Price } from "@/types/product"
import { useVariantSelection } from "../hooks/use-variant-selection"
import type { QuickViewDetailsProps } from "../quick-view.types"
import { AddToCartBar } from "./add-to-cart-bar"
import { OptionPicker } from "./option-picker"
import { StockPill } from "./stock-pill"

export const QuickViewDetails = ({ product, titleId }: QuickViewDetailsProps): React.JSX.Element => {
  const { selectedOptions, selectedVariant, selectOption, isValueAvailable } = useVariantSelection(product)
  const price: Price | undefined = selectedVariant?.prices[0]

  return (
    <div className="flex h-full flex-col">
      <p className="text-xs tracking-widest text-muted uppercase">{product.collection.title}</p>
      <h2 id={titleId} className="mt-1 pr-16 font-serif text-3xl leading-tight md:text-4xl">
        {product.title}
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {price && <p className="text-2xl font-semibold">{formatPrice(price.amount, price.currency_code)}</p>}
        <StockPill quantity={selectedVariant?.inventory_quantity ?? 0} />
      </div>

      <p className="mt-5 border-b border-line pb-6 text-sm leading-relaxed text-ink/80">{product.description}</p>

      <div className="mt-6 flex flex-col gap-6">
        {product.options.map((option) => (
          <OptionPicker
            key={option.id}
            option={option}
            selectedValue={selectedOptions[option.title]}
            isValueAvailable={(value) => isValueAvailable(option.title, value)}
            onSelect={(value) => selectOption(option.title, value)}
          />
        ))}
      </div>

      {selectedVariant && <p className="mt-4 text-xs text-muted">SKU {selectedVariant.sku}</p>}

      <div className="mt-8 md:mt-auto md:pt-8">
        <AddToCartBar key={selectedVariant?.id ?? "none"} variant={selectedVariant} />
      </div>
    </div>
  )
}
