import { useId } from "react"
import { cn } from "@/shared/utils/cn"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import type { TextFieldProps } from "../checkout.types"

export const TextField = ({ label, hint, className, ...inputProps }: TextFieldProps): React.JSX.Element => {
  const inputId: string = useId()
  const hintId: string = `${inputId}-hint`

  return (
    <div className={className}>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <input id={inputId} aria-describedby={hint ? hintId : undefined} className={cn("mt-2", INPUT_CLASSES)} {...inputProps} />
    </div>
  )
}
