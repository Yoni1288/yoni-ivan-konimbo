"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId } from "react"
import { useForm } from "react-hook-form"
import type { AuthSession } from "@/features/auth/auth.types"
import { AuthField, getDescribedBy } from "@/features/auth/components/auth-field"
import { selectSession } from "@/features/auth/store/auth.selectors"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type { CartLine } from "@/features/cart/cart.types"
import { selectCartCurrencyCode, selectCartItems, selectCartSubtotal } from "@/features/cart/store/cart.selectors"
import { useCartStore } from "@/features/cart/store/cart.store"
import { HttpError } from "@/shared/errors/http-error"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import { COUNTRY_CODES, COUNTRY_NAMES, DEFAULT_COUNTRY_CODE, getOrderConfirmationPath } from "../checkout.constants"
import { checkoutFormSchema } from "../checkout.schemas"
import type { CheckoutFormValues, CheckoutItem, CheckoutSectionProps } from "../checkout.types"
import { usePlaceOrderMutation } from "../hooks/use-place-order-mutation"
import { TextField } from "./text-field"

const SECTION_HEADING_CLASSES: string = "text-lg font-semibold"

const GENERIC_ORDER_ERROR: string = "Couldn't place your order. Please try again."

// 4xx messages come from our own route (stock, email in use), so they're safe and useful to show.
const getOrderErrorMessage = (error: Error): string => {
  if (error instanceof HttpError && error.statusCode < 500) {
    return error.message
  }

  return GENERIC_ORDER_ERROR
}

const getDefaultValues = (session: AuthSession | null): CheckoutFormValues => {
  return { email: session?.user.email ?? "", firstName: "", lastName: "", address1: "", address2: "", city: "", postalCode: "", country: DEFAULT_COUNTRY_CODE, phone: "" }
}

export const CheckoutForm = ({ isCartReady }: CheckoutSectionProps): React.JSX.Element => {
  const router = useRouter()
  const countryId: string = useId()
  const session: AuthSession | null = useAuthStore(selectSession)
  const items: CartLine[] = useCartStore(selectCartItems)
  const subtotal: number = useCartStore(selectCartSubtotal)
  const currencyCode: string = useCartStore(selectCartCurrencyCode)
  const placeOrderMutation = usePlaceOrderMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutFormSchema), mode: "onTouched", defaultValues: getDefaultValues(session) })
  const hasItems: boolean = isCartReady && Boolean(items.length)
  const canPlaceOrder: boolean = hasItems && !placeOrderMutation.isPending
  const buttonLabel: string = hasItems ? `Place order · ${formatPrice(subtotal, currencyCode)}` : "Place order"
  const countryError: string | undefined = errors.country?.message
  const orderError: Error | null = placeOrderMutation.error

  const submitOrder = (values: CheckoutFormValues): void => {
    const orderItems: CheckoutItem[] = items.map((line) => ({ variantId: line.variantId, quantity: line.quantity }))
    placeOrderMutation.mutate({ ...values, items: orderItems }, { onSuccess: ({ orderNumber }) => router.push(getOrderConfirmationPath(orderNumber)) })
  }

  return (
    <form onSubmit={handleSubmit(submitOrder)} noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <h2 className={SECTION_HEADING_CLASSES}>Contact</h2>
        <TextField label="Email" type="email" autoComplete="email" placeholder="name@example.com" error={errors.email?.message} {...register("email")} />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className={SECTION_HEADING_CLASSES}>Shipping address</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
          <TextField label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
        </div>
        <TextField label="Street address" autoComplete="address-line1" error={errors.address1?.message} {...register("address1")} />
        <TextField label="Apartment, suite, etc." hint="Optional" autoComplete="address-line2" error={errors.address2?.message} {...register("address2")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
          <TextField label="Postal code" autoComplete="postal-code" error={errors.postalCode?.message} {...register("postalCode")} />
        </div>
        <AuthField inputId={countryId} label="Country" error={countryError}>
          <div className="relative">
            <select
              id={countryId}
              autoComplete="country"
              aria-invalid={Boolean(countryError)}
              aria-describedby={getDescribedBy(countryId, undefined, countryError)}
              className={cn(INPUT_CLASSES, "appearance-none pr-10")}
              {...register("country")}
            >
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {COUNTRY_NAMES[code]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" strokeWidth={1.5} />
          </div>
        </AuthField>
        <TextField label="Phone" hint="Optional — only used for delivery updates" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
      </section>

      <div>
        {orderError && (
          <p role="alert" className="mb-4 text-center text-sm text-danger">
            {getOrderErrorMessage(orderError)}
          </p>
        )}
        <button
          type="submit"
          disabled={!canPlaceOrder}
          className="h-14 w-full rounded-full bg-ink px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          {placeOrderMutation.isPending ? "Placing order…" : buttonLabel}
        </button>
        <p className="mt-3 text-center text-xs text-muted">Demo store — no payment is taken.</p>
      </div>
    </form>
  )
}
