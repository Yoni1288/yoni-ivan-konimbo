import { ChevronLeft, ChevronRight } from "lucide-react"

type CatalogPaginationProps = {
  offset: number
  limit: number
  shown: number
  total: number
}

const PAGE_BUTTON_CLASSES: string = "flex size-11 items-center justify-center rounded-full text-sm transition-colors"
const ARROW_BUTTON_CLASSES: string = `${PAGE_BUTTON_CLASSES} border border-line bg-white hover:border-ink disabled:border-transparent disabled:bg-transparent disabled:text-muted/50`

function getPageNumbers(limit: number, total: number): number[] {
  const pageCount: number = Math.max(1, Math.ceil(total / limit))
  return Array.from({ length: pageCount }, (_, index) => index + 1)
}

// Page buttons are placeholders; navigation is not wired to the URL yet.
export function CatalogPagination({ offset, limit, shown, total }: CatalogPaginationProps): React.JSX.Element {
  const currentPage: number = Math.floor(offset / limit) + 1
  const pageNumbers: number[] = getPageNumbers(limit, total)
  const firstShown: number = offset + 1
  const lastShown: number = offset + shown

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-6 sm:grid sm:grid-cols-[1fr_auto_1fr]">
      <p className="text-xs text-muted sm:justify-self-start">
        Showing {firstShown}–{lastShown} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" disabled={currentPage === 1} className={ARROW_BUTTON_CLASSES}>
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>
        {pageNumbers.map((pageNumber) => {
          const isCurrent: boolean = pageNumber === currentPage
          const stateClasses: string = isCurrent ? "bg-ink font-medium text-white" : "hover:bg-black/5"
          return (
            <button key={pageNumber} type="button" aria-current={isCurrent ? "page" : undefined} className={`${PAGE_BUTTON_CLASSES} ${stateClasses}`}>
              {pageNumber}
            </button>
          )
        })}
        <button type="button" aria-label="Next page" disabled={currentPage === pageNumbers.length} className={ARROW_BUTTON_CLASSES}>
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
