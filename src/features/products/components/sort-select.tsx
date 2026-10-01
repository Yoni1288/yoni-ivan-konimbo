"use client"

import { ChevronDown } from "lucide-react"
import { useProductFilters } from "../hooks/use-product-filters"
import { productSortSchema } from "../products.schemas"
import type { SortOption, SortSelectFieldProps } from "../products.types"

const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
]

const SortSelectField = ({ value, onChange }: SortSelectFieldProps): React.JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange?.(productSortSchema.parse(event.target.value))
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      Sort by
      <span className="relative">
        <select
          value={value}
          disabled={!onChange}
          onChange={handleChange}
          className="h-11 appearance-none rounded-lg border border-line bg-white pr-9 pl-3 text-sm text-ink outline-none focus:border-ink"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" strokeWidth={1.5} />
      </span>
    </label>
  )
}

// Shown while the search params are not available yet (static prerender), so the toolbar doesn't shift.
export const SortSelectFallback = (): React.JSX.Element => {
  return <SortSelectField value="featured" />
}

export const SortSelect = (): React.JSX.Element => {
  const { filters, setSort } = useProductFilters()
  return <SortSelectField value={filters.sort} onChange={setSort} />
}
