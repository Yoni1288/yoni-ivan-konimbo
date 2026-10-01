import type { RedirectTargetProps } from "../auth.types"
import { AuthCard } from "./auth-card"
import { LoginForm } from "./login-form"

export const LoginCard = ({ redirectTo }: RedirectTargetProps): React.JSX.Element => {
  return (
    <AuthCard title="Sign in" description="Welcome back. Enter your details to continue.">
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  )
}
