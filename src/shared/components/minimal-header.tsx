import Link from "next/link"

// Header for focused pages (sign-in, checkout): the logo plus one item on the right, without the cart or account icons.
export const MinimalHeader = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl">
          Goodsmith
        </Link>
        {children}
      </div>
    </header>
  )
}
