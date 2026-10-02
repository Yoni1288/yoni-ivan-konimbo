import type { z } from "zod"
import type { CartLine } from "@/features/cart/cart.types"
import type { checkoutFormSchema, checkoutItemSchema, checkoutRequestSchema, checkoutResponseSchema, orderConfirmationSchema, orderNumberParamsSchema } from "./checkout.schemas"

export type CheckoutSectionProps = {
  isCartReady: boolean
}

export type TextFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  label: string
  hint?: string
  error?: string
}

export type SummaryLineProps = {
  line: CartLine
  index: number
}

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

export type CheckoutItem = z.infer<typeof checkoutItemSchema>

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>

export type OrderNumberParams = z.infer<typeof orderNumberParamsSchema>

export type OrderConfirmationRouteContext = {
  params: Promise<OrderNumberParams>
}

export type OrderConfirmation = z.infer<typeof orderConfirmationSchema>

export type OrderConfirmationItem = OrderConfirmation["items"][number]

export type OrderConfirmationViewProps = {
  orderNumber: string | null
}

export type OrderConfirmationPageProps = {
  searchParams: Promise<{ order?: string | string[] }>
}

export type DetailListProps = {
  label: string
  lines: string[]
}

export type OrderConfirmationDetailsProps = {
  order: OrderConfirmation
}
