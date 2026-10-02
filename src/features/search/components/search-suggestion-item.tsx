import Image from "next/image"
import { getLowestPrice } from "@/features/products/utils/product-display"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import type { Price } from "@/types/product"
import type { SearchSuggestionItemProps } from "../search.types"

export const SearchSuggestionItem = ({ id, product, isActive, onSelect }: SearchSuggestionItemProps): React.JSX.Element => {
  const { title, thumbnail, collection } = product
  const lowestPrice: Price | null = getLowestPrice(product)

  return (
    <li
      id={id}
      role="option"
      aria-selected={isActive}
      // Keeps focus in the input so its blur handler doesn't close the list before the click lands.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect(product)}
      className={cn("flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2 hover:bg-canvas", isActive && "bg-canvas")}
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-line">{thumbnail && <Image src={thumbnail} alt="" fill sizes="40px" className="object-cover" />}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-2xs tracking-widest text-muted uppercase">{collection.title}</p>
      </div>
      {lowestPrice && <span className="shrink-0 text-xs font-semibold">{formatPrice(lowestPrice.amount, lowestPrice.currency_code)}</span>}
    </li>
  )
}
