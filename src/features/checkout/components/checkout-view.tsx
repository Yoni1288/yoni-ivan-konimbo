"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRequireSession } from "@/features/auth/hooks/use-require-session"
import { useCartHydration } from "@/features/cart/hooks/use-cart-hydration"
import { useCartStore } from "@/features/cart/store/cart.store"
import { CHECKOUT_PATH } from "../checkout.constants"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"

const MAIN_CLASSES: string = "mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 lg:pt-10"

// Checkout needs a signed-in user; signed-out visitors are sent to sign-in and brought back here afterwards.
export const CheckoutView = (): React.JSX.Element => {
  const isSignedIn: boolean = useRequireSession(CHECKOUT_PATH)
  const isCartReady: boolean = useCartHydration()
  const openCart: () => void = useCartStore((state) => state.openCart)

  if (!isSignedIn) {
    return (
      <main className={MAIN_CLASSES} aria-busy="true">
        <p className="text-sm text-muted">Checking your account…</p>
      </main>
    )
  }

  return (
    <main className={MAIN_CLASSES}>
      {/* The shop header's cart drawer reads isOpen when it mounts, so "Back to cart" lands on the products page with the drawer open. */}
      <Link href="/products" onClick={openCart} className="inline-flex min-h-11 items-center gap-2 text-sm text-ink/80 hover:text-ink">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Back to cart
      </Link>
      <h1 className="mt-1 font-serif text-5xl">Checkout</h1>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-checkout lg:gap-16">
        <OrderSummary isCartReady={isCartReady} />
        <CheckoutForm isCartReady={isCartReady} />
      </div>
    </main>
  )
}
