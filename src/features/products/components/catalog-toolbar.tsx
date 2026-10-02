"use client"

import { Suspense } from "react"
import { SearchAutocomplete } from "@/features/search/components/search-autocomplete"
import { useProductFilters } from "../hooks/use-product-filters"
import { useProductsQuery } from "../hooks/use-products-query"
import { SortSelect, SortSelectFallback } from "./sort-select"

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
      <SearchAutocomplete />

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <Suspense fallback={null}>
          <ProductCount />
        </Suspense>
        <Suspense fallback={<SortSelectFallback />}>
          <SortSelect />
        </Suspense>
      </div>
    </div>
  )
}
