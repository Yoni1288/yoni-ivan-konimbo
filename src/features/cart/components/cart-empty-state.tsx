import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import type { CartEmptyStateProps } from "../cart.types"

export const CartEmptyState = ({ onStartShopping }: CartEmptyStateProps): React.JSX.Element => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div aria-hidden="true" className="relative flex size-24 items-center justify-center rounded-full bg-canvas">
        <ShoppingBag className="size-7" strokeWidth={1.5} />
        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white text-2xs font-medium shadow-sm">0</span>
      </div>
      <p className="mt-6 font-serif text-3xl">Your cart is empty</p>
      <p className="mt-3 max-w-xs text-sm text-muted">Looks like you haven&apos;t added anything yet. Browse the collection and use Quick View to add a product.</p>
      <Link href="/products" onClick={onStartShopping} className="mt-6 flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-white transition-opacity hover:opacity-90">
        Start shopping
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </Link>
    </div>
  )
}
