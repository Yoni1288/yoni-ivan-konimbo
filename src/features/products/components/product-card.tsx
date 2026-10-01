import { cva } from "class-variance-authority"
import { Eye } from "lucide-react"
import Image from "next/image"
import { cn } from "@/shared/utils/cn"
import { formatPrice } from "@/shared/utils/format-price"
import { getTileClass } from "@/shared/utils/tile-class"
import type { Price } from "@/types/product"
import type { BadgeStockStatus, ColorSwatch, ProductCardProps, StockStatus } from "../products.types"
import { getColorSwatches, getLowestPrice, getStockStatus } from "../utils/product-display"

const stockBadge = cva("absolute top-3 left-3 rounded-full px-2.5 py-1 text-2xs font-medium", {
  variants: {
    status: {
      "low-stock": "bg-badge-low text-ink",
      "sold-out": "bg-ink text-white",
    },
  },
})

const STOCK_BADGE_LABELS: Record<BadgeStockStatus, string> = {
  "low-stock": "Low stock",
  "sold-out": "Sold out",
}

const StockBadge = ({ status }: { status: StockStatus }): React.JSX.Element | null => {
  if (status === "in-stock") {
    return null
  }

  return <span className={stockBadge({ status })}>{STOCK_BADGE_LABELS[status]}</span>
}

const SwatchDots = ({ swatches }: { swatches: ColorSwatch[] }): React.JSX.Element | null => {
  if (!swatches.length) {
    return null
  }

  return (
    <ul className="flex shrink-0 gap-1" aria-label="Available colors">
      {swatches.map(({ name, className }) => (
        <li key={name} title={name} className={cn("size-2.5 rounded-full ring-1 ring-black/10", className)}>
          <span className="sr-only">{name}</span>
        </li>
      ))}
    </ul>
  )
}

export const ProductCard = ({ product, index, onQuickView }: ProductCardProps): React.JSX.Element => {
  const { thumbnail, title, collection } = product
  const lowestPrice: Price | null = getLowestPrice(product)
  const stockStatus: StockStatus = getStockStatus(product)
  const swatches: ColorSwatch[] = getColorSwatches(product)
  const tileClass: string = getTileClass(index)

  return (
    <article>
      <div className={cn("relative aspect-4/5 overflow-hidden rounded-xl", tileClass)}>
        <Image src={thumbnail} alt={title} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <StockBadge status={stockStatus} />
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view: ${title}`}
          className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 rounded-full bg-white text-xs font-medium shadow-sm transition-colors hover:bg-canvas"
        >
          <Eye className="size-4" strokeWidth={1.5} />
          Quick view
        </button>
      </div>
      <p className="mt-3 text-2xs tracking-widest text-muted uppercase">{collection.title}</p>
      <h3 className="mt-0.5 text-sm font-medium">{title}</h3>
      <div className="mt-1 flex items-center justify-between gap-2">
        {lowestPrice && (
          <p className="text-xs">
            From <span className="text-sm font-semibold">{formatPrice(lowestPrice.amount, lowestPrice.currency_code)}</span>
          </p>
        )}
        <SwatchDots swatches={swatches} />
      </div>
    </article>
  )
}
