import { User } from "lucide-react"
import Link from "next/link"
import { CartButton } from "@/features/cart/components/cart-button"

export const SiteHeader = (): React.JSX.Element => {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl">
          Goodsmith
        </Link>
        <div className="flex items-center">
          <Link href="/login" aria-label="Sign in" className="flex size-11 items-center justify-center rounded-full hover:bg-black/5">
            <User className="size-5" strokeWidth={1.5} />
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
