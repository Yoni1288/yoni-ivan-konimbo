import { useId } from "react"
import { AuthField, getDescribedBy } from "@/features/auth/components/auth-field"
import { INPUT_CLASSES } from "@/shared/utils/input-classes"
import type { TextFieldProps } from "../checkout.types"

export const TextField = ({ label, hint, error, className, ...inputProps }: TextFieldProps): React.JSX.Element => {
  const inputId: string = useId()

  return (
    <div className={className}>
      <AuthField inputId={inputId} label={label} hint={hint} error={error}>
        <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={getDescribedBy(inputId, hint, error)} className={INPUT_CLASSES} {...inputProps} />
      </AuthField>
    </div>
  )
}
