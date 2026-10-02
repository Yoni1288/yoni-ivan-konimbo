import type { Metadata } from "next"
import type { AuthPageProps } from "@/features/auth/auth.types"
import { AuthPanel } from "@/features/auth/components/auth-panel"
import { LoginCard } from "@/features/auth/components/login-card"
import { parseRedirectPath } from "@/features/auth/utils/redirect-path"

export const metadata: Metadata = {
  title: "Account · Yoni Ivan",
}

const LoginPage = async ({ searchParams }: AuthPageProps): Promise<React.JSX.Element> => {
  const { next } = await searchParams

  return (
    <AuthPanel>
      <LoginCard redirectTo={parseRedirectPath(next)} />
    </AuthPanel>
  )
}

export default LoginPage
