"use client"

import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { useRequireSession } from "@/features/auth/hooks/use-require-session"
import { formatPrice } from "@/shared/utils/format-price"
import { getOrderConfirmationPath, ORDER_CONFIRMATION_PATH } from "../checkout.constants"
import type { DetailListProps, OrderConfirmationDetailsProps, OrderConfirmationItem, OrderConfirmationViewProps } from "../checkout.types"
import { useClearCartAfterOrder } from "../hooks/use-clear-cart-after-order"
import { useOrderConfirmationQuery } from "../hooks/use-order-confirmation-query"

const MAIN_CLASSES: string = "mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 pb-20 text-center sm:px-6 sm:pt-20"

const DETAIL_LABEL_CLASSES: string = "text-xs tracking-widest text-muted uppercase"

const formatItemLine = ({ title, variantTitle, quantity }: OrderConfirmationItem): string => {
  return `${title} · ${variantTitle} × ${quantity}`
}

const DetailList = ({ label, lines }: DetailListProps): React.JSX.Element => {
  return (
    <div>
      <h2 className={DETAIL_LABEL_CLASSES}>{label}</h2>
      <ul className="mt-3 space-y-1">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

const ContinueShoppingLink = (): React.JSX.Element => {
  return (
    <Link href="/products" className="mt-12 inline-flex h-14 items-center gap-3 rounded-full bg-ink px-10 text-base font-semibold text-white transition-opacity hover:opacity-90">
      Continue shopping
      <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
    </Link>
  )
}

const OrderConfirmationLoading = (): React.JSX.Element => {
  return (
    <main className={MAIN_CLASSES} aria-busy="true" aria-label="Loading your order">
      <div className="size-20 animate-pulse rounded-full bg-line sm:size-24" />
      <div className="mt-6 h-4 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 h-12 w-full max-w-sm animate-pulse rounded bg-line" />
      <div className="mt-10 h-48 w-full animate-pulse rounded-2xl bg-line" />
    </main>
  )
}

const OrderNotFound = (): React.JSX.Element => {
  return (
    <main className={MAIN_CLASSES}>
      <h1 className="font-serif text-4xl sm:text-5xl">We couldn&apos;t find this order.</h1>
      <p className="mt-5 max-w-md text-lg text-muted">Check the link, or look for the confirmation email we sent you.</p>
      <ContinueShoppingLink />
    </main>
  )
}

// Rendered only once the order has loaded, so the cart is cleared after the success state is on screen.
const OrderConfirmationDetails = ({ order }: OrderConfirmationDetailsProps): React.JSX.Element => {
  const { orderNumber, firstName, email, shippingAddressLines, items, totalPaid, currencyCode } = order
  useClearCartAfterOrder()

  return (
    <main className={MAIN_CLASSES}>
      <div className="flex size-20 items-center justify-center rounded-full bg-success text-white sm:size-24">
        <Check className="size-8 sm:size-10" strokeWidth={2} aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm font-semibold tracking-widest text-success uppercase">Order #{orderNumber}</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Thank you, {firstName}.</h1>
      <p className="mt-5 max-w-md text-lg text-muted">
        Your order is confirmed.
        {email && (
          <>
            {" "}
            A receipt is on its way to <span className="font-medium break-all text-ink">{email}</span>.
          </>
        )}
      </p>

      <section aria-label="Order details" className="mt-10 grid w-full gap-8 rounded-2xl bg-white p-6 text-left sm:grid-cols-3 sm:p-10">
        <DetailList label="Shipping to" lines={shippingAddressLines} />
        <DetailList label="Items" lines={items.map(formatItemLine)} />
        <div>
          <h2 className={DETAIL_LABEL_CLASSES}>Total paid</h2>
          <p className="mt-3 text-3xl font-semibold">{formatPrice(totalPaid, currencyCode)}</p>
        </div>
      </section>

      <ContinueShoppingLink />
    </main>
  )
}

export const OrderConfirmationView = ({ orderNumber }: OrderConfirmationViewProps): React.JSX.Element => {
  const isSignedIn: boolean = useRequireSession(orderNumber ? getOrderConfirmationPath(orderNumber) : ORDER_CONFIRMATION_PATH)
  const orderQuery = useOrderConfirmationQuery(orderNumber)

  if (!orderNumber || orderQuery.isError) {
    return <OrderNotFound />
  }

  if (!isSignedIn || !orderQuery.data) {
    return <OrderConfirmationLoading />
  }

  return <OrderConfirmationDetails order={orderQuery.data} />
}
