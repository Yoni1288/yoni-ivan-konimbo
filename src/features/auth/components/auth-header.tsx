import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MinimalHeader } from "@/shared/components/minimal-header"

export const AuthHeader = (): React.JSX.Element => {
  return (
    <MinimalHeader>
      <Link href="/products" className="flex min-h-11 items-center gap-2 px-1 text-sm text-ink/80 hover:text-ink">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Back to shop
      </Link>
    </MinimalHeader>
  )
}
