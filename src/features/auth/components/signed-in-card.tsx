"use client"

import Link from "next/link"
import type { AuthState, SignedInCardProps } from "../auth.types"
import { selectClearSession } from "../store/auth.selectors"
import { useAuthStore } from "../store/auth.store"
import { AuthCard } from "./auth-card"

// The token is a stateless JWT, so logging out only forgets it in this browser.
export const SignedInCard = ({ session }: SignedInCardProps): React.JSX.Element => {
  const { userName, email } = session.user
  const clearSession: AuthState["clearSession"] = useAuthStore(selectClearSession)

  return (
    <AuthCard
      title="Signed in"
      description={
        <>
          You&apos;re signed in as <strong className="font-semibold text-ink">{userName}</strong>.
        </>
      }
    >
      {email && <p className="mt-1 text-sm text-muted">{email}</p>}
      <div className="mt-6 flex flex-col gap-2">
        <button type="button" onClick={clearSession} className="h-12 rounded-full bg-ink text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Log out
        </button>
        <Link href="/products" className="mx-auto flex min-h-11 items-center px-2 text-sm underline underline-offset-4 hover:text-muted">
          Continue shopping
        </Link>
      </div>
    </AuthCard>
  )
}
