import type { z } from "zod"
import type { Product } from "@/types/product"
import type { productFiltersSchema, productIdParamsSchema, productListQuerySchema } from "./products.schemas"

export type ProductListQuery = z.infer<typeof productListQuerySchema>

export type ProductFilters = z.infer<typeof productFiltersSchema>

export type ProductFiltersState = {
  filters: ProductFilters
  setOffset: (offset: number) => void
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
