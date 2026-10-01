import { cva } from "class-variance-authority"
import { getStockStatusForQuantity } from "@/features/products/utils/product-display"
import type { StockStatus } from "@/features/products/products.types"

const stockPill = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", {
  variants: {
    status: {
      "in-stock": "bg-success-soft text-success",
      "low-stock": "bg-badge-low text-warning",
      "sold-out": "bg-line text-muted",
    },
  },
})

const stockDot = cva("size-1.5 rounded-full", {
  variants: {
    status: {
      "in-stock": "bg-success",
      "low-stock": "bg-warning",
      "sold-out": "bg-muted",
    },
  },
})

const getStockLabel = (status: StockStatus, quantity: number): string => {
  if (status === "sold-out") {
    return "Sold out"
  }

  if (status === "low-stock") {
    return `Only ${quantity} left`
  }

  return "In stock"
}

export const StockPill = ({ quantity }: { quantity: number }): React.JSX.Element => {
  const status: StockStatus = getStockStatusForQuantity(quantity)

  return (
    <span className={stockPill({ status })}>
      <span className={stockDot({ status })} aria-hidden="true" />
      {getStockLabel(status, quantity)}
    </span>
  )
}
