import { cva } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CatalogPaginationProps = {
  offset: number
  limit: number
  shown: number
  total: number
  onOffsetChange: (offset: number) => void
}

const pageButton = cva("flex size-11 items-center justify-center rounded-full text-sm transition-colors", {
  variants: {
    variant: {
      page: "hover:bg-black/5",
      current: "bg-ink font-medium text-white",
      arrow: "border border-line bg-white hover:border-ink disabled:border-transparent disabled:bg-transparent disabled:text-muted/50",
    },
  },
})

const getPageNumbers = (limit: number, total: number): number[] => {
  const pageCount: number = Math.max(1, Math.ceil(total / limit))
  return Array.from({ length: pageCount }, (_, index) => index + 1)
}

export const CatalogPagination = ({ offset, limit, shown, total, onOffsetChange }: CatalogPaginationProps): React.JSX.Element => {
  const currentPage: number = Math.floor(offset / limit) + 1
  const pageNumbers: number[] = getPageNumbers(limit, total)
  const firstShown: number = offset + 1
  const lastShown: number = offset + shown

  const goToPage = (page: number): void => {
    onOffsetChange((page - 1) * limit)
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-6 sm:grid sm:grid-cols-pagination">
      <p className="text-xs text-muted sm:justify-self-start">
        Showing {firstShown}–{lastShown} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} className={pageButton({ variant: "arrow" })}>
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>
        {pageNumbers.map((pageNumber) => {
          const isCurrent: boolean = pageNumber === currentPage
          return (
            <button
              key={pageNumber}
              type="button"
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${pageNumber}`}
              onClick={() => goToPage(pageNumber)}
              className={pageButton({ variant: isCurrent ? "current" : "page" })}
            >
              {pageNumber}
            </button>
          )
        })}
        <button type="button" aria-label="Next page" disabled={currentPage === pageNumbers.length} onClick={() => goToPage(currentPage + 1)} className={pageButton({ variant: "arrow" })}>
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
