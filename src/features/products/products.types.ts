import type { z } from "zod"
import type { productIdParamsSchema, productListQuerySchema } from "./products.schemas"

export type ProductListQuery = z.infer<typeof productListQuerySchema>

export type ProductIdParams = z.infer<typeof productIdParamsSchema>

export type ProductRouteContext = {
  params: Promise<ProductIdParams>
}

export type StockStatus = "in-stock" | "low-stock" | "sold-out"

export type ColorSwatch = {
  name: string
  hex: string
}
