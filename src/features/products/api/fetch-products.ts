import { apiGet } from "@/shared/api/api-client"
import type { ProductsResponse } from "@/types/product"
import { productsResponseSchema } from "../products.schemas"
import type { ProductFilters } from "../products.types"

const MINOR_UNITS_PER_SHEKEL: number = 100

export const fetchProducts = (filters: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams({ offset: String(filters.offset) })

  if (filters.collection) {
    params.set("collection", filters.collection)
  }

  if (filters.sort !== "featured") {
    params.set("sort", filters.sort)
  }

  if (filters.priceFrom !== undefined) {
    params.set("min_price", String(filters.priceFrom * MINOR_UNITS_PER_SHEKEL))
  }

  if (filters.priceTo !== undefined) {
    params.set("max_price", String(filters.priceTo * MINOR_UNITS_PER_SHEKEL))
  }

  return apiGet(`/api/products?${params}`, productsResponseSchema)
}
