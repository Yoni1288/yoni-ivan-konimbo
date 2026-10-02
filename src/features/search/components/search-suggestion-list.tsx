import { cn } from "@/shared/utils/cn"
import { SEARCH_MIN_LENGTH } from "../search.constants"
import type { SearchSuggestionListProps } from "../search.types"
import { SearchSuggestionItem } from "./search-suggestion-item"

const PANEL_CLASSES: string = "absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lg"

export const getSuggestionId = (listboxId: string, index: number): string => {
  return `${listboxId}-option-${index}`
}

const SuggestionMessage = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <div className={PANEL_CLASSES}>
      <p role="status" className="px-4 py-3 text-sm text-muted">
        {children}
      </p>
    </div>
  )
}

export const SearchSuggestionList = ({ listboxId, suggestions, activeIndex, onSelect }: SearchSuggestionListProps): React.JSX.Element => {
  const { term, products, isWaiting, isError } = suggestions

  if (term.length < SEARCH_MIN_LENGTH) {
    return <SuggestionMessage>Type at least {SEARCH_MIN_LENGTH} letters</SuggestionMessage>
  }

  if (isError && !isWaiting) {
    return <SuggestionMessage>Couldn&apos;t load suggestions. Please try again.</SuggestionMessage>
  }

  if (!products.length && isWaiting) {
    return <SuggestionMessage>Searching…</SuggestionMessage>
  }

  if (!products.length) {
    return <SuggestionMessage>No products match “{term}”</SuggestionMessage>
  }

  // While the next term is pending, the previous results stay visible but dimmed instead of flashing away.
  return (
    <div className={PANEL_CLASSES}>
      <ul id={listboxId} role="listbox" aria-label="Product suggestions" aria-busy={isWaiting} className={cn("max-h-80 overflow-y-auto py-1 transition-opacity", isWaiting && "opacity-60")}>
        {products.map((product, index) => (
          <SearchSuggestionItem key={product.id} id={getSuggestionId(listboxId, index)} product={product} isActive={index === activeIndex} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}
