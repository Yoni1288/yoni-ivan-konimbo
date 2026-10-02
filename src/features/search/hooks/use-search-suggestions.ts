import { useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value"
import type { Product } from "@/types/product"
import { fetchSearchSuggestions } from "../api/fetch-search-suggestions"
import { searchKeys } from "../api/search-keys"
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from "../search.constants"
import type { SearchResponse, SearchSuggestions } from "../search.types"

const normalizeTerm = (value: string): string => {
  return value.trim().toLowerCase()
}

// Guards the list against repeated rows so React keys and keyboard navigation stay unambiguous.
const uniqueProducts = (response: SearchResponse): Product[] => {
  const productsById = new Map<string, Product>(response.products.map((product) => [product.id, product]))
  return [...productsById.values()]
}

// The query key is the normalized term, so a late response for an older term lands in that term's cache entry and is never shown.
// TanStack Query also dedupes in-flight requests per key and aborts the previous request through `signal` when the term changes.
export const useSearchSuggestions = (inputValue: string): SearchSuggestions => {
  const typedTerm: string = normalizeTerm(inputValue)
  const debouncedTerm: string = normalizeTerm(useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS))
  const isSearchable: boolean = debouncedTerm.length >= SEARCH_MIN_LENGTH

  const { data, isFetching, isError } = useQuery({
    queryKey: searchKeys.suggestions(debouncedTerm),
    queryFn: ({ signal }) => fetchSearchSuggestions(debouncedTerm, signal),
    enabled: isSearchable,
    select: uniqueProducts,
  })

  return {
    term: typedTerm,
    products: data ?? [],
    isWaiting: typedTerm !== debouncedTerm || isFetching,
    isError,
  }
}
