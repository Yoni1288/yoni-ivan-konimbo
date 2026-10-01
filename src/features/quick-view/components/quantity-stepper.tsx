import { Minus, Plus } from "lucide-react"
import type { QuantityStepperProps } from "../quick-view.types"

const STEP_BUTTON_CLASSES: string = "flex size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 disabled:text-muted/50 disabled:hover:bg-transparent"

export const QuantityStepper = ({ quantity, max, onChange }: QuantityStepperProps): React.JSX.Element => {
  return (
    <div className="flex h-14 shrink-0 items-center rounded-full border border-line px-1.5">
      <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => onChange(quantity - 1)} className={STEP_BUTTON_CLASSES}>
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <span className="w-8 text-center text-sm font-medium" aria-live="polite" aria-label={`Quantity ${quantity}`}>
        {quantity}
      </span>
      <button type="button" aria-label="Increase quantity" disabled={quantity >= max} onClick={() => onChange(quantity + 1)} className={STEP_BUTTON_CLASSES}>
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
