import { cva } from "class-variance-authority"
import type { AuthFieldProps } from "../auth.types"

const fieldMessage = cva("mt-1.5 text-xs", {
  variants: {
    tone: {
      hint: "text-muted",
      error: "text-danger",
    },
  },
})

export const getFieldMessageId = (inputId: string): string => `${inputId}-message`

// For the input's aria-describedby: points at the hint or error shown under it, if either exists.
export const getDescribedBy = (inputId: string, hint: string | undefined, error: string | undefined): string | undefined => {
  return hint || error ? getFieldMessageId(inputId) : undefined
}

// Label, input and one message under it: the error when there is one, otherwise the hint.
export const AuthField = ({ inputId, label, hint, error, children }: AuthFieldProps): React.JSX.Element => {
  const message: string | undefined = error ?? hint

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {message && (
        <p id={getFieldMessageId(inputId)} className={fieldMessage({ tone: error ? "error" : "hint" })}>
          {message}
        </p>
      )}
    </div>
  )
}
