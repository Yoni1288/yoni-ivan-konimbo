"use client"

import { Search } from "lucide-react"
import { useId, useState } from "react"
import { QuickViewDialog } from "@/features/quick-view/components/quick-view-dialog"
import type { Product } from "@/types/product"
import { useSearchSuggestions } from "../hooks/use-search-suggestions"
import type { SearchSuggestions } from "../search.types"
import { getSuggestionId, SearchSuggestionList } from "./search-suggestion-list"

const NO_ACTIVE_INDEX: number = -1

const wrapIndex = (index: number, count: number): number => {
  return (index + count) % count
}

export const SearchAutocomplete = (): React.JSX.Element => {
  const listboxId: string = useId()
  const [inputValue, setInputValue] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(NO_ACTIVE_INDEX)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const suggestions: SearchSuggestions = useSearchSuggestions(inputValue)
  const { products } = suggestions
  const isListVisible: boolean = isOpen && Boolean(suggestions.term)
  const activeProduct: Product | undefined = products[activeIndex]

  const changeInput = (value: string): void => {
    setInputValue(value)
    setActiveIndex(NO_ACTIVE_INDEX)
    setIsOpen(true)
  }

  const selectProduct = (product: Product): void => {
    setIsOpen(false)
    setQuickViewProduct(product)
  }

  const moveActiveIndex = (step: number): void => {
    if (!products.length) {
      return
    }

    setIsOpen(true)
    setActiveIndex(wrapIndex(activeIndex + step, products.length))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      moveActiveIndex(1)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      moveActiveIndex(-1)
      return
    }

    if (event.key === "Enter" && isListVisible && activeProduct) {
      event.preventDefault()
      selectProduct(activeProduct)
      return
    }

    // Closes the list first; a second Escape falls through to the native search input, which clears the text.
    if (event.key === "Escape" && isListVisible) {
      event.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
        <input
          type="search"
          role="combobox"
          placeholder="Search products"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isListVisible}
          aria-controls={listboxId}
          aria-activedescendant={isListVisible && activeProduct ? getSuggestionId(listboxId, activeIndex) : undefined}
          value={inputValue}
          onChange={(event) => changeInput(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-sm outline-none focus:border-ink"
        />
      </label>

      {isListVisible && <SearchSuggestionList listboxId={listboxId} suggestions={suggestions} activeIndex={activeIndex} onSelect={selectProduct} />}
      {quickViewProduct && <QuickViewDialog key={quickViewProduct.id} product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  )
}
