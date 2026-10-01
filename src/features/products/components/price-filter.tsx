"use client"

import { ArrowRight } from "lucide-react"
import { useId, useState } from "react"
import { useProductFilters } from "../hooks/use-product-filters"
import { priceRangeFormSchema } from "../products.schemas"
import type { PriceFilterFormProps, PriceRange } from "../products.types"

const INPUT_CLASSES: string = "mt-1 h-11 w-full min-w-0 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-ink aria-invalid:border-danger"

const toInputValue = (value: number | undefined): string => {
  return value === undefined ? "" : String(value)
}

const readFormField = (formData: FormData, name: string): string => {
  const value: FormDataEntryValue | null = formData.get(name)
  return typeof value === "string" ? value : ""
}

// Uncontrolled inputs: the URL holds the applied range, and the parent re-keys this form when it changes.
const PriceFilterForm = ({ range, onApply }: PriceFilterFormProps): React.JSX.Element => {
  const [error, setError] = useState<string | null>(null)
  const errorId: string = useId()
  const isDisabled: boolean = !onApply

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = priceRangeFormSchema.safeParse({ from: readFormField(formData, "from"), to: readFormField(formData, "to") })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setError(null)
    onApply?.(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3">
      <div className="flex items-end gap-2">
        <label className="flex-1 text-xs text-muted">
          From
          <input
            name="from"
            type="text"
            inputMode="numeric"
            placeholder="₪0"
            defaultValue={toInputValue(range.from)}
            disabled={isDisabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={INPUT_CLASSES}
          />
        </label>
        <label className="flex-1 text-xs text-muted">
          To
          <input
            name="to"
            type="text"
            inputMode="numeric"
            placeholder="₪1,500"
            defaultValue={toInputValue(range.to)}
            disabled={isDisabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={INPUT_CLASSES}
          />
        </label>
        <button
          type="submit"
          aria-label="Apply price filter"
          disabled={isDisabled}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  )
}

export const PriceFilterFallback = (): React.JSX.Element => {
  return <PriceFilterForm range={{ from: undefined, to: undefined }} />
}

export const PriceFilter = (): React.JSX.Element => {
  const { filters, setPriceRange } = useProductFilters()
  const range: PriceRange = { from: filters.priceFrom, to: filters.priceTo }

  return <PriceFilterForm key={`${range.from}-${range.to}`} range={range} onApply={setPriceRange} />
}
