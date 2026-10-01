import { Lock } from "lucide-react"
import { MinimalHeader } from "@/shared/components/minimal-header"

export const CheckoutHeader = (): React.JSX.Element => {
  return (
    <MinimalHeader>
      <p className="flex items-center gap-2 text-sm text-ink/80">
        <Lock className="size-4" strokeWidth={1.5} />
        Secure checkout
      </p>
    </MinimalHeader>
  )
}
