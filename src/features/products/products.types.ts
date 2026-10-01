import type { z } from "zod"
import type { Product } from "@/types/product"
import type { priceRangeFormSchema, productFiltersSchema, productIdParamsSchema, productListQuerySchema, productSortSchema } from "./products.schemas"

export type ProductListQuery = z.infer<typeof productListQuerySchema>

export type ProductSort = z.infer<typeof productSortSchema>

export type ProductFilters = z.infer<typeof productFiltersSchema>

export type PriceRange = z.infer<typeof priceRangeFormSchema>

export type ProductFiltersState = {
  filters: ProductFilters
  setOffset: (offset: number) => void
  setCollection: (collection: string | undefined) => void
  setSort: (sort: ProductSort) => void
  setPriceRange: (range: PriceRange) => void
}

export type SortOption = {
  value: ProductSort
  label: string
}

// Without onApply the form renders disabled (Suspense fallback).
export type PriceFilterFormProps = {
  range: PriceRange
  onApply?: (range: PriceRange) => void
}

// Without onChange the select renders disabled (Suspense fallback).
export type SortSelectFieldProps = {
  value: ProductSort
  onChange?: (sort: ProductSort) => void
}

export type ProductIdParams = z.infer<typeof productIdParamsSchema>

export type ProductRouteContext = {
  params: Promise<ProductIdParams>
}

export type StockStatus = "in-stock" | "low-stock" | "sold-out"

export type BadgeStockStatus = Exclude<StockStatus, "in-stock">

export type ColorSwatch = {
  name: string
  className: string
}

export type GridMessageProps = {
  title: string
  detail: string
  children?: React.ReactNode
}

export type ProductCardProps = {
  product: Product
  index: number
  onQuickView: (product: Product) => void
}
