import { cva } from "class-variance-authority"
import { getSwatchClass, isSwatchOption } from "@/features/products/utils/product-display"
import { cn } from "@/shared/utils/cn"
import type { OptionPickerProps, OptionValueState } from "../quick-view.types"

const optionValueButton = cva("flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors", {
  variants: {
    state: {
      selected: "border-ink bg-ink text-white",
      available: "border-line bg-white hover:border-ink",
      unavailable: "cursor-not-allowed border-line bg-white text-muted line-through",
    },
  },
})

const getValueState = (isSelected: boolean, isAvailable: boolean): OptionValueState => {
  if (isSelected) {
    return "selected"
  }

  return isAvailable ? "available" : "unavailable"
}

const SwatchDot = ({ value }: { value: string }): React.JSX.Element | null => {
  const swatchClass: string | null = getSwatchClass(value)

  if (!swatchClass) {
    return null
  }

  return <span className={cn("size-4 rounded-full ring-1 ring-black/10", swatchClass)} aria-hidden="true" />
}

export const OptionPicker = ({ option, selectedValue, isValueAvailable, onSelect }: OptionPickerProps): React.JSX.Element => {
  const showSwatches: boolean = isSwatchOption(option.title)

  return (
    <fieldset>
      <legend className="text-sm text-muted">
        {option.title} <span className="font-medium text-ink">{selectedValue}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected: boolean = value === selectedValue
          const state: OptionValueState = getValueState(isSelected, isValueAvailable(value))
          return (
            <button key={value} type="button" aria-pressed={isSelected} disabled={state === "unavailable"} onClick={() => onSelect(value)} className={optionValueButton({ state })}>
              {showSwatches && <SwatchDot value={value} />}
              {value}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
