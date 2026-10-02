import type { Metadata } from "next"
import type { AuthPageProps } from "@/features/auth/auth.types"
import { AuthPanel } from "@/features/auth/components/auth-panel"
import { RegisterCard } from "@/features/auth/components/register-card"
import { parseRedirectPath } from "@/features/auth/utils/redirect-path"

export const metadata: Metadata = {
  title: "Create account · Yoni Ivan",
}

const RegisterPage = async ({ searchParams }: AuthPageProps): Promise<React.JSX.Element> => {
  const { next } = await searchParams

  return (
    <AuthPanel>
      <RegisterCard redirectTo={parseRedirectPath(next)} />
    </AuthPanel>
  )
}

export default RegisterPage
