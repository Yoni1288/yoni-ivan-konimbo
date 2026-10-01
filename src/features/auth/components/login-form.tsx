"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useId } from "react"
import { useForm } from "react-hook-form"
import { HttpError } from "@/shared/errors/http-error"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import { loginSchema } from "../auth.schemas"
import type { LoginFormValues, RedirectTargetProps } from "../auth.types"
import { useCompleteSignIn } from "../hooks/use-complete-sign-in"
import { useSignInMutation } from "../hooks/use-sign-in-mutation"
import { getRegisterPath } from "../utils/redirect-path"
import { AuthField, getDescribedBy } from "./auth-field"
import { PasswordInput } from "./password-input"

const getSignInErrorMessage = (error: Error): string => {
  if (error instanceof HttpError && error.statusCode === 401) {
    return "Invalid username or password"
  }

  return "Couldn't sign in. Please try again."
}

export const LoginForm = ({ redirectTo }: RedirectTargetProps): React.JSX.Element => {
  const usernameId: string = useId()
  const passwordId: string = useId()
  const signInMutation = useSignInMutation()
  const completeSignIn = useCompleteSignIn(redirectTo)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: "onTouched", defaultValues: { username: "", password: "" } })
  const usernameError: string | undefined = errors.username?.message
  const passwordError: string | undefined = errors.password?.message

  const submitLogin = (credentials: LoginFormValues): void => {
    signInMutation.mutate(credentials, { onSuccess: completeSignIn })
  }

  return (
    <form onSubmit={handleSubmit(submitLogin)} noValidate className="mt-6 flex flex-col gap-5">
      <AuthField inputId={usernameId} label="Username" error={usernameError}>
        <input
          id={usernameId}
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={Boolean(usernameError)}
          aria-describedby={getDescribedBy(usernameId, undefined, usernameError)}
          className={INPUT_CLASSES}
          {...register("username")}
        />
      </AuthField>

      <AuthField inputId={passwordId} label="Password" error={passwordError}>
        <PasswordInput
          id={passwordId}
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={getDescribedBy(passwordId, undefined, passwordError)}
          className={INPUT_CLASSES}
          {...register("password")}
        />
      </AuthField>

      {signInMutation.error && (
        <p role="alert" className="text-center text-sm text-danger">
          {getSignInErrorMessage(signInMutation.error)}
        </p>
      )}

      <button type="submit" disabled={signInMutation.isPending} className="mt-1 h-12 rounded-full bg-ink text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
        Sign in
      </button>

      <p className="text-center text-sm text-ink/80">
        New here?{" "}
        <Link href={getRegisterPath(redirectTo)} className="font-medium text-ink underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </form>
  )
}
