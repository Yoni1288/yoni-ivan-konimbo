import { Eye } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/shared/utils/format-price"
import type { Price, Product } from "@/types/product"
import type { ColorSwatch, StockStatus } from "../products.types"
import { getColorSwatches, getLowestPrice, getStockStatus } from "../utils/product-display"

const TILE_CLASSES: string[] = ["bg-tile-1", "bg-tile-2", "bg-tile-3", "bg-tile-4", "bg-tile-5", "bg-tile-6"]

type ProductCardProps = {
  product: Product
  index: number
}

function StockBadge({ status }: { status: StockStatus }): React.JSX.Element | null {
  if (status === "sold-out") {
    return <span className="absolute top-3 left-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-white">Sold out</span>
  }

  if (status === "low-stock") {
    return <span className="absolute top-3 left-3 rounded-full bg-badge-low px-2.5 py-1 text-[11px] font-medium text-ink">Low stock</span>
  }

  return null
}

function SwatchDots({ swatches }: { swatches: ColorSwatch[] }): React.JSX.Element | null {
  if (!swatches.length) {
    return null
  }

  return (
    <ul className="flex shrink-0 gap-1" aria-label="Available colors">
      {swatches.map((swatch) => (
        <li key={swatch.name} title={swatch.name} className="size-2.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: swatch.hex }}>
          <span className="sr-only">{swatch.name}</span>
        </li>
      ))}
    </ul>
  )
}

export function ProductCard({ product, index }: ProductCardProps): React.JSX.Element {
  const lowestPrice: Price | null = getLowestPrice(product)
  const stockStatus: StockStatus = getStockStatus(product)
  const swatches: ColorSwatch[] = getColorSwatches(product)
  const tileClass: string = TILE_CLASSES[index % TILE_CLASSES.length]

  return (
    <article>
      <div className={`relative aspect-4/5 overflow-hidden rounded-xl ${tileClass}`}>
        <Image src={product.thumbnail} alt={product.title} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <StockBadge status={stockStatus} />
        <button type="button" className="absolute inset-x-3 bottom-3 flex h-11 items-center justify-center gap-2 rounded-full bg-white text-xs font-medium shadow-sm transition-colors hover:bg-canvas">
          <Eye className="size-4" strokeWidth={1.5} />
          Quick view
        </button>
      </div>
      <p className="mt-3 text-[11px] tracking-widest text-muted uppercase">{product.collection.title}</p>
      <h3 className="mt-0.5 text-sm font-medium">{product.title}</h3>
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
