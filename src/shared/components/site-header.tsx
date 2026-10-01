import { ShoppingBag, User } from "lucide-react"
import Link from "next/link"

const cartItemCount: number = 0

export const SiteHeader = (): React.JSX.Element => {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl">
          Goodsmith
        </Link>
        <div className="flex items-center">
          <button type="button" aria-label="Account" className="flex size-11 items-center justify-center rounded-full hover:bg-black/5">
            <User className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label={`Cart, ${cartItemCount} items`} className="relative flex size-11 items-center justify-center rounded-full hover:bg-black/5">
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-2xs font-medium text-white">{cartItemCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
