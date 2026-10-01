"use client"

import Link from "next/link"
import type { CartLine } from "@/features/cart/cart.types"
import { selectCartCurrencyCode, selectCartItems, selectCartSubtotal } from "@/features/cart/store/cart.selectors"
import { useCartStore } from "@/features/cart/store/cart.store"
import { getLineTotal } from "@/features/cart/utils/cart-totals"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import { getTileClass } from "@/shared/utils/tile-class"
import type { CheckoutSectionProps, SummaryLineProps } from "../checkout.types"

const SKELETON_LINES: number = 2

const SummaryLine = ({ line, index }: SummaryLineProps): React.JSX.Element => {
  const { title, variantTitle, quantity, currencyCode } = line

  return (
    <li className="flex items-center gap-4">
      <div className={cn("relative size-14 shrink-0 rounded-lg", getTileClass(index))}>
        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-ink text-2xs font-medium text-white" aria-label={`Quantity ${quantity}`}>
          {quantity}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{variantTitle}</p>
      </div>
      <p className="shrink-0 text-sm">{formatPrice(getLineTotal(line), currencyCode)}</p>
    </li>
  )
}

const SummaryLines = ({ isCartReady }: CheckoutSectionProps): React.JSX.Element => {
  const items: CartLine[] = useCartStore(selectCartItems)

  if (!isCartReady) {
    return (
      <ul className="flex flex-col gap-4" aria-busy="true" aria-label="Loading your cart">
        {Array.from({ length: SKELETON_LINES }, (_, index) => (
          <li key={index} className="h-14 animate-pulse rounded-lg bg-line" />
        ))}
      </ul>
    )
  }

  if (!items.length) {
    return (
      <p className="text-sm text-muted">
        Your cart is empty.{" "}
        <Link href="/products" className="text-ink underline underline-offset-4">
          Continue shopping
        </Link>
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((line, index) => (
        <SummaryLine key={line.variantId} line={line} index={index} />
      ))}
    </ul>
  )
}

export const OrderSummary = ({ isCartReady }: CheckoutSectionProps): React.JSX.Element => {
  const subtotal: number = useCartStore(selectCartSubtotal)
  const currencyCode: string = useCartStore(selectCartCurrencyCode)
  const formattedSubtotal: string = formatPrice(subtotal, currencyCode)

  return (
    <aside aria-labelledby="order-summary-title" className="rounded-2xl bg-white p-6 lg:sticky lg:top-8 lg:order-last">
      <h2 id="order-summary-title" className="mb-5 text-lg font-semibold">
        Order summary
      </h2>
      <SummaryLines isCartReady={isCartReady} />
      <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formattedSubtotal}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd>Free</dd>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <dt className="font-medium">Total</dt>
          <dd className="text-2xl font-semibold">{formattedSubtotal}</dd>
        </div>
      </dl>
    </aside>
  )
}
