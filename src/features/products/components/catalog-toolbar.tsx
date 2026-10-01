"use client"

import { ChevronDown, Search } from "lucide-react"
import { Suspense } from "react"
import { useProductFilters } from "../hooks/use-product-filters"
import { useProductsQuery } from "../hooks/use-products-query"

const SORT_OPTIONS: string[] = ["Featured", "Price: low to high", "Price: high to low", "Newest"]

const ProductCount = (): React.JSX.Element | null => {
  const { filters } = useProductFilters()
  const { data } = useProductsQuery(filters)

  if (!data) {
    return null
  }

  return <span className="text-xs text-muted">{data.count} products</span>
}

export const CatalogToolbar = (): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-xs">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
        <input type="search" placeholder="Search products" className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-sm outline-none focus:border-ink" />
      </label>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Suspense fallback={null}>
          <ProductCount />
        </Suspense>
        <label className="flex items-center gap-2 text-xs text-muted">
          Sort by
          <span className="relative">
            <select className="h-11 appearance-none rounded-lg border border-line bg-white pr-9 pl-3 text-sm text-ink outline-none focus:border-ink">
              {SORT_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" strokeWidth={1.5} />
          </span>
        </label>
      </div>
    </div>
  )
}
