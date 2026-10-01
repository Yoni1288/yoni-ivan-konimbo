import { CheckoutHeader } from "@/features/checkout/components/checkout-header"

const CheckoutLayout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <>
      <CheckoutHeader />
      <div className="flex-1">{children}</div>
    </>
  )
}

export default CheckoutLayout
