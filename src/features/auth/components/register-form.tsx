"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useId } from "react"
import { useForm } from "react-hook-form"
import { HttpError } from "@/shared/errors/http-error"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import { registerFormSchema } from "../auth.schemas"
import type { RedirectTargetProps, RegisterFormValues } from "../auth.types"
import { useCompleteSignIn } from "../hooks/use-complete-sign-in"
import { useRegisterMutation } from "../hooks/use-register-mutation"
import { getLoginPath } from "../utils/redirect-path"
import { AuthField, getDescribedBy } from "./auth-field"
import { PasswordInput } from "./password-input"

const USERNAME_HINT: string = "3–20 characters: letters, numbers, dots or underscores."
const PASSWORD_HINT: string = "At least 8 characters."

const isUsernameTakenError = (error: Error): boolean => {
  return error instanceof HttpError && error.statusCode === 409
}

export const RegisterForm = ({ redirectTo }: RedirectTargetProps): React.JSX.Element => {
  const usernameId: string = useId()
  const passwordId: string = useId()
  const confirmPasswordId: string = useId()
  const registerMutation = useRegisterMutation()
  const completeSignIn = useCompleteSignIn(redirectTo)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema), mode: "onTouched", defaultValues: { username: "", password: "", confirmPassword: "" } })
  const usernameError: string | undefined = errors.username?.message
  const passwordError: string | undefined = errors.password?.message
  const confirmPasswordError: string | undefined = errors.confirmPassword?.message
  const mutationError: Error | null = registerMutation.error
  const hasUnexpectedError: boolean = mutationError !== null && !isUsernameTakenError(mutationError)

  const submitRegistration = ({ username, password }: RegisterFormValues): void => {
    registerMutation.mutate(
      { username, password },
      {
        onSuccess: completeSignIn,
        // A taken username is shown on the username field itself, like any other field error.
        onError: (error: Error) => {
          if (isUsernameTakenError(error)) {
            setError("username", { message: "That username is already taken" }, { shouldFocus: true })
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(submitRegistration)} noValidate className="mt-6 flex flex-col gap-5">
      <AuthField inputId={usernameId} label="Username" hint={USERNAME_HINT} error={usernameError}>
        <input
          id={usernameId}
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={Boolean(usernameError)}
          aria-describedby={getDescribedBy(usernameId, USERNAME_HINT, usernameError)}
          className={INPUT_CLASSES}
          {...register("username")}
        />
      </AuthField>

      <AuthField inputId={passwordId} label="Password" hint={PASSWORD_HINT} error={passwordError}>
        <PasswordInput
          id={passwordId}
          autoComplete="new-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={getDescribedBy(passwordId, PASSWORD_HINT, passwordError)}
          className={INPUT_CLASSES}
          {...register("password")}
        />
      </AuthField>

      <AuthField inputId={confirmPasswordId} label="Confirm password" error={confirmPasswordError}>
        <input
          id={confirmPasswordId}
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(confirmPasswordError)}
          aria-describedby={getDescribedBy(confirmPasswordId, undefined, confirmPasswordError)}
          className={INPUT_CLASSES}
          {...register("confirmPassword")}
        />
      </AuthField>

      {hasUnexpectedError && (
        <p role="alert" className="text-center text-sm text-danger">
          Couldn&apos;t create your account. Please try again.
        </p>
      )}

      <button type="submit" disabled={registerMutation.isPending} className="mt-1 h-12 rounded-full bg-ink text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
        Create account
      </button>

      <p className="text-center text-sm text-ink/80">
        Already have an account?{" "}
        <Link href={getLoginPath(redirectTo)} className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  )
}
