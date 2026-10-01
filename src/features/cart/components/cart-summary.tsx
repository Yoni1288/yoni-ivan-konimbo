import { ArrowRight } from "lucide-react"
import { formatPrice } from "@/shared/utils/format-price"
import type { CartSummaryProps } from "../cart.types"

export const CartSummary = ({ subtotal, currencyCode, onContinueShopping }: CartSummaryProps): React.JSX.Element => {
  return (
    <div className="border-t border-line bg-canvas px-6 pt-5 pb-6">
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(subtotal, currencyCode)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd>Calculated at checkout</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 pt-3">
          <dt className="font-medium">Total</dt>
          <dd className="text-xl font-semibold">{formatPrice(subtotal, currencyCode)}</dd>
        </div>
      </dl>
      <button type="button" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-opacity hover:opacity-90">
        Checkout
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </button>
      <button type="button" onClick={onContinueShopping} className="mx-auto mt-2 flex min-h-11 items-center px-2 text-sm underline underline-offset-4 hover:text-muted">
        Continue shopping
      </button>
    </div>
  )
}
