import type { Metadata } from "next"
import { CheckoutView } from "@/features/checkout/components/checkout-view"

export const metadata: Metadata = {
  title: "Checkout · Goodsmith",
}

const CheckoutPage = (): React.JSX.Element => {
  return <CheckoutView />
}

export default CheckoutPage
