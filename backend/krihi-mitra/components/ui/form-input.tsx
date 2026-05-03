"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  leadingIcon?: React.ReactNode
  trailingSlot?: React.ReactNode
}

export const FormInput = React.forwardRef<HTMLInputElement, Props>(function FormInput(
  { label, hint, error, leadingIcon, trailingSlot, className, id, ...props },
  ref,
) {
  const inputId = id || React.useId()
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-card transition-colors focus-within:ring-2 focus-within:ring-ring",
          error ? "border-destructive" : "border-input",
        )}
      >
        {leadingIcon ? (
          <span className="pl-3 text-muted-foreground" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            "flex-1 bg-transparent py-3 px-3 outline-none text-foreground placeholder:text-muted-foreground/70 text-base",
            leadingIcon && "pl-1",
            trailingSlot && "pr-1",
            className,
          )}
          {...props}
        />
        {trailingSlot ? <span className="pr-2">{trailingSlot}</span> : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
