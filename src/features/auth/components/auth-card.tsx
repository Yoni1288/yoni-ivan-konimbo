import { useId } from "react"
import type { AuthCardProps } from "../auth.types"

const CARD_CLASSES: string = "w-full max-w-sm rounded-2xl border border-line/60 bg-white p-6 shadow-lg shadow-black/5 sm:p-8"

export const AuthCard = ({ title, description, children }: AuthCardProps): React.JSX.Element => {
  const titleId: string = useId()

  return (
    <section aria-labelledby={titleId} className={CARD_CLASSES}>
      <h1 id={titleId} className="font-serif text-4xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-ink/80">{description}</p>
      {children}
    </section>
  )
}

// Same size as the real card, shown while the saved session loads so a signed-in user never sees the form flash.
export const AuthCardSkeleton = (): React.JSX.Element => {
  return (
    <div className={CARD_CLASSES} aria-busy="true" aria-label="Loading your account">
      <div className="h-9 w-32 animate-pulse rounded-lg bg-line" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded bg-line" />
      <div className="mt-8 h-12 animate-pulse rounded-lg bg-line" />
      <div className="mt-5 h-12 animate-pulse rounded-full bg-line" />
    </div>
  )
}
