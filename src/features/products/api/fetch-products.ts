import { apiGet } from "@/shared/api/api-client"
import type { ProductsResponse } from "@/types/product"
import { productsResponseSchema } from "../products.schemas"
import type { ProductFilters } from "../products.types"

export const fetchProducts = (filters: ProductFilters): Promise<ProductsResponse> => {
  const params = new URLSearchParams({ offset: String(filters.offset) })
  return apiGet(`/api/products?${params}`, productsResponseSchema)
}
