"use client"

import { X } from "lucide-react"
import { useEffect, useId, useRef } from "react"
import type { QuickViewDialogProps } from "../quick-view.types"
import { ProductGallery } from "./product-gallery"
import { QuickViewDetails } from "./quick-view-details"

const SCROLL_LOCK_CLASS: string = "overflow-hidden"

export const QuickViewDialog = ({ product, onClose }: QuickViewDialogProps): React.JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId: string = useId()

  // showModal gives the native backdrop, Esc handling and focus management; the page itself must stop scrolling underneath.
  useEffect(() => {
    dialogRef.current?.showModal()
    document.documentElement.classList.add(SCROLL_LOCK_CLASS)
    return () => document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
  }, [])

  // close() restores focus to the Quick view button synchronously. Its "close" event is queued and
  // can be delayed (e.g. in background tabs), so the parent is told directly instead of via that event.
  const closeDialog = (): void => {
    dialogRef.current?.close()
    onClose()
  }

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    closeDialog()
  }

  // A click whose target is the <dialog> itself landed on the backdrop, outside the content.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) {
      closeDialog()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-white p-0 text-ink backdrop:bg-ink/50 md:m-auto md:h-fit md:max-h-9/10 md:max-w-5xl md:rounded-2xl"
    >
      <div className="grid md:grid-cols-2">
        <div className="bg-canvas p-4 md:p-6">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="relative p-6 md:p-10">
          <div className="absolute top-4 right-4 flex items-center gap-2 md:top-8 md:right-8">
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-sans text-2xs text-muted md:inline-block">Esc</kbd>
            <button type="button" aria-label="Close" onClick={closeDialog} className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <QuickViewDetails product={product} titleId={titleId} />
        </div>
      </div>
    </dialog>
  )
}
