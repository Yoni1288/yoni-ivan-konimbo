import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { ProductsResponse } from "@/types/product"
import { fetchProducts } from "../api/fetch-products"
import { productKeys } from "../api/product-keys"
import type { ProductFilters } from "../products.types"

export const useProductsQuery = (filters: ProductFilters): UseQueryResult<ProductsResponse> => {
  return useQuery({ queryKey: productKeys.list(filters), queryFn: () => fetchProducts(filters), placeholderData: keepPreviousData })
}
