"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"
import type { PasswordInputProps } from "../auth.types"

export const PasswordInput = ({ className, ...inputProps }: PasswordInputProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const ToggleIcon = isVisible ? EyeOff : Eye

  return (
    <div className="relative">
      <input {...inputProps} type={isVisible ? "text" : "password"} className={cn(className, "pr-12")} />
      <button
        type="button"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-ink/70 hover:text-ink"
      >
        <ToggleIcon className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
