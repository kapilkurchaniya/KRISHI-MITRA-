import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Variant = "success" | "warning" | "info" | "error"

const styles: Record<Variant, string> = {
  success: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-accent/15 text-accent border-accent/30",
  info: "bg-secondary text-secondary-foreground border-border",
  error: "bg-destructive/10 text-destructive border-destructive/30",
}

const Icon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  error: XCircle,
}

type Props = {
  variant?: Variant
  title?: string
  children: React.ReactNode
  className?: string
}

export function StatusBanner({ variant = "info", title, children, className }: Props) {
  const I = Icon[variant]
  return (
    <div
      role="status"
      className={cn("flex items-start gap-3 rounded-xl border p-3", styles[variant], className)}
    >
      <I className="size-5 mt-0.5 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {title ? <div className="font-semibold">{title}</div> : null}
        <div className={cn(title && "opacity-90")}>{children}</div>
      </div>
    </div>
  )
}
