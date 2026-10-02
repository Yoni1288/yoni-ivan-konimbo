import type { Metadata } from "next"
import { orderNumberSchema } from "@/features/checkout/checkout.schemas"
import type { OrderConfirmationPageProps } from "@/features/checkout/checkout.types"
import { OrderConfirmationView } from "@/features/checkout/components/order-confirmation-view"

export const metadata: Metadata = {
  title: "Order confirmed · Goodsmith",
}

const OrderConfirmationPage = async ({ searchParams }: OrderConfirmationPageProps): Promise<React.JSX.Element> => {
  const { order } = await searchParams
  const parsedOrderNumber = orderNumberSchema.safeParse(order)
  return <OrderConfirmationView orderNumber={parsedOrderNumber.success ? parsedOrderNumber.data : null} />
}

export default OrderConfirmationPage
