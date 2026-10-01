"use client"

import { ChevronDown } from "lucide-react"
import { useId } from "react"
import { selectCartCurrencyCode, selectCartItemCount, selectCartSubtotal } from "@/features/cart/store/cart.selectors"
import { useCartStore } from "@/features/cart/store/cart.store"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import type { CheckoutSectionProps } from "../checkout.types"
import { TextField } from "./text-field"

const COUNTRIES: string[] = ["Israel", "United States", "United Kingdom", "Germany", "France"]

const SECTION_HEADING_CLASSES: string = "text-lg font-semibold"

// Placeholder form: the fields are not wired to state, validation or an order backend yet.
export const CheckoutForm = ({ isCartReady }: CheckoutSectionProps): React.JSX.Element => {
  const countryId: string = useId()
  const itemCount: number = useCartStore(selectCartItemCount)
  const subtotal: number = useCartStore(selectCartSubtotal)
  const currencyCode: string = useCartStore(selectCartCurrencyCode)
  const canPlaceOrder: boolean = isCartReady && Boolean(itemCount)
  const buttonLabel: string = canPlaceOrder ? `Place order · ${formatPrice(subtotal, currencyCode)}` : "Place order"

  return (
    <form noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <h2 className={SECTION_HEADING_CLASSES}>Contact</h2>
        <TextField label="Email" type="email" autoComplete="email" placeholder="name@example.com" />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className={SECTION_HEADING_CLASSES}>Shipping address</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="First name" autoComplete="given-name" />
          <TextField label="Last name" autoComplete="family-name" />
        </div>
        <TextField label="Street address" autoComplete="address-line1" />
        <TextField label="Apartment, suite, etc." hint="Optional" autoComplete="address-line2" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="City" autoComplete="address-level2" />
          <TextField label="Postal code" autoComplete="postal-code" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor={countryId} className="text-sm font-medium">
            Country
          </label>
          <div className="relative mt-2">
            <select id={countryId} autoComplete="country-name" defaultValue="Israel" className={cn(INPUT_CLASSES, "appearance-none pr-10")}>
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" strokeWidth={1.5} />
          </div>
        </div>
        <TextField label="Phone" hint="Optional — only used for delivery updates" type="tel" autoComplete="tel" />
      </section>

      <div>
        <button
          type="button"
          disabled={!canPlaceOrder}
          className="h-14 w-full rounded-full bg-ink px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          {buttonLabel}
        </button>
        <p className="mt-3 text-center text-xs text-muted">Demo store — no payment is taken.</p>
      </div>
    </form>
  )
}
