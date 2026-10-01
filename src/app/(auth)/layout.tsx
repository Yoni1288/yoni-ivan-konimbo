import { AuthHeader } from "@/features/auth/components/auth-header"

const AuthLayout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <>
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
    </>
  )
}

export default AuthLayout
