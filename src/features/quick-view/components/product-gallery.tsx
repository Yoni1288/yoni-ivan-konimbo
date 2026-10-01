"use client"

import { cva } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"
import type { ProductGalleryProps } from "../quick-view.types"

const ARROW_BUTTON_CLASSES: string = "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-canvas"

const thumbnailButton = cva("relative aspect-5/4 overflow-hidden rounded-lg bg-tile-1 transition", {
  variants: {
    active: {
      true: "ring-2 ring-ink",
      false: "opacity-70 hover:opacity-100",
    },
  },
})

const wrapIndex = (index: number, length: number): number => {
  return (index + length) % length
}

export const ProductGallery = ({ images, title }: ProductGalleryProps): React.JSX.Element | null => {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  if (!images.length) {
    return null
  }

  const hasMultipleImages: boolean = images.length > 1
  const showImage = (index: number): void => setActiveIndex(wrapIndex(index, images.length))
  const stepImage = (step: number): void => setActiveIndex((current) => wrapIndex(current + step, images.length))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-tile-1 md:aspect-4/5">
        <Image src={images[activeIndex].url} alt={`${title}, image ${activeIndex + 1} of ${images.length}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        {hasMultipleImages && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => stepImage(-1)} className={cn(ARROW_BUTTON_CLASSES, "left-3")}>
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Next image" onClick={() => stepImage(1)} className={cn(ARROW_BUTTON_CLASSES, "right-3")}>
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => showImage(index)}
              className={thumbnailButton({ active: index === activeIndex })}
            >
              <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
