import { cn } from "@/lib/utils"

type Props = {
  size?: number
  className?: string
  withText?: boolean
}

export function LeafLogo({ size = 36, className, withText = false }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className="rounded-2xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 21c0-7.5 5-13 13-13 1.5 0 3 .25 4.5.7C18.5 17 12 22 3 21Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M5 19c2-4 5.5-7.5 11-9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-primary-foreground"
          />
        </svg>
      </div>
      {withText ? (
        <div className="leading-tight">
          <div className="font-serif font-bold text-foreground">AI Krishi</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Smart farming
          </div>
        </div>
      ) : null}
    </div>
  )
}
