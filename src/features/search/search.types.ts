import type { z } from "zod"
import type { Product } from "@/types/product"
import type { searchQuerySchema, searchResponseSchema } from "./search.schemas"

export type SearchQuery = z.infer<typeof searchQuerySchema>

export type SearchResponse = z.infer<typeof searchResponseSchema>

export type SearchSuggestions = {
  term: string
  products: Product[]
  isWaiting: boolean
  isError: boolean
}

export type SearchSuggestionListProps = {
  listboxId: string
  suggestions: SearchSuggestions
  activeIndex: number
  onSelect: (product: Product) => void
}

export type SearchSuggestionItemProps = {
  id: string
  product: Product
  isActive: boolean
  onSelect: (product: Product) => void
}
