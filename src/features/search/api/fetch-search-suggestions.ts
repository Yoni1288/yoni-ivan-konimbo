import { apiGet } from "@/shared/api/api-client"
import { searchResponseSchema } from "../search.schemas"
import type { SearchResponse } from "../search.types"

export const fetchSearchSuggestions = (term: string, signal: AbortSignal): Promise<SearchResponse> => {
  const params = new URLSearchParams({ q: term })
  return apiGet(`/api/search?${params}`, searchResponseSchema, {}, signal)
}
