import { QuantityStepper } from "@/features/quick-view/components/quantity-stepper"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import { getTileClass } from "@/shared/utils/tile-class"
import type { CartLineItemProps } from "../cart.types"
import { useCartStore } from "../store/cart.store"
import { getLineTotal } from "../utils/cart-totals"

export const CartLineItem = ({ line, index }: CartLineItemProps): React.JSX.Element => {
  const { variantId, title, variantTitle, unitPrice, currencyCode, quantity, inventoryQuantity } = line
  const updateQuantity: (variantId: string, quantity: number) => void = useCartStore((state) => state.updateQuantity)
  const removeItem: (variantId: string) => void = useCartStore((state) => state.removeItem)

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <div className={cn("h-24 w-20 shrink-0 rounded-lg", getTileClass(index))} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{title}</p>
          <p className="shrink-0 text-sm font-semibold">{formatPrice(getLineTotal(line), currencyCode)}</p>
        </div>
        <p className="mt-1 text-xs text-muted">{variantTitle}</p>
        <p className="mt-0.5 text-xs text-muted">{formatPrice(unitPrice, currencyCode)} each</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper quantity={quantity} max={inventoryQuantity} onChange={(newQuantity) => updateQuantity(variantId, newQuantity)} />
          <button type="button" onClick={() => removeItem(variantId)} className="min-h-11 px-1 text-xs underline underline-offset-4 hover:text-muted">
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
