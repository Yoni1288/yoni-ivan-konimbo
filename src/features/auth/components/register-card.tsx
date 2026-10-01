import type { RedirectTargetProps } from "../auth.types"
import { AuthCard } from "./auth-card"
import { RegisterForm } from "./register-form"

export const RegisterCard = ({ redirectTo }: RedirectTargetProps): React.JSX.Element => {
  return (
    <AuthCard title="Create account" description="Pick a username and password to get started.">
      <RegisterForm redirectTo={redirectTo} />
    </AuthCard>
  )
}
