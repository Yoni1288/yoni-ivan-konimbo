"use client"

import { X } from "lucide-react"
import { useEffect, useId, useRef } from "react"
import type { CartLine } from "../cart.types"
import { selectCartItemCount, selectCartItems, selectCartSubtotal } from "../store/cart.selectors"
import { useCartStore } from "../store/cart.store"
import { CartEmptyState } from "./cart-empty-state"
import { CartLineItem } from "./cart-line-item"
import { CartSummary } from "./cart-summary"

const SCROLL_LOCK_CLASS: string = "overflow-hidden"
const FALLBACK_CURRENCY_CODE: string = "ILS"

export const CartDrawer = (): React.JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId: string = useId()
  const lines: CartLine[] = useCartStore(selectCartItems)
  const itemCount: number = useCartStore(selectCartItemCount)
  const subtotal: number = useCartStore(selectCartSubtotal)
  const closeCart: () => void = useCartStore((state) => state.closeCart)
  const itemCountLabel: string = itemCount === 1 ? "1 item" : `${itemCount} items`
  const currencyCode: string = lines[0]?.currencyCode ?? FALLBACK_CURRENCY_CODE

  // Same approach as QuickViewDialog: showModal gives the backdrop, Esc and focus trapping; the page must not scroll underneath.
  useEffect(() => {
    dialogRef.current?.showModal()
    document.documentElement.classList.add(SCROLL_LOCK_CLASS)
    return () => document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
  }, [])

  const closeDrawer = (): void => {
    dialogRef.current?.close()
    closeCart()
  }

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    closeDrawer()
  }

  // A click whose target is the <dialog> itself landed on the backdrop, outside the panel.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) {
      closeDrawer()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-none flex-col bg-white p-0 text-ink backdrop:bg-ink/50 open:flex sm:max-w-md"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line py-4 pr-4 pl-6">
        <h2 id={titleId} className="flex items-baseline gap-2">
          <span className="font-serif text-3xl">Your cart</span>
          <span className="text-xs font-medium text-muted">{itemCountLabel}</span>
        </h2>
        <button type="button" aria-label="Close cart" onClick={closeDrawer} className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5">
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      {lines.length ? (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {lines.map((line, index) => (
              <CartLineItem key={line.variantId} line={line} index={index} />
            ))}
          </ul>
          <CartSummary subtotal={subtotal} currencyCode={currencyCode} onContinueShopping={closeDrawer} />
        </>
      ) : (
        <CartEmptyState onStartShopping={closeDrawer} />
      )}
    </dialog>
  )
}
