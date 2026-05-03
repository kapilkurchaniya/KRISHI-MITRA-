"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string
  options: Option[]
  hint?: string
  error?: string
  placeholder?: string
}

export const FormSelect = React.forwardRef<HTMLSelectElement, Props>(function FormSelect(
  { label, options, hint, error, placeholder, className, id, ...props },
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
          "relative rounded-xl border bg-card transition-colors focus-within:ring-2 focus-within:ring-ring",
          error ? "border-destructive" : "border-input",
        )}
      >
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            "appearance-none w-full bg-transparent py-3 pl-3 pr-10 outline-none text-foreground text-base",
            className,
          )}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
        />
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
