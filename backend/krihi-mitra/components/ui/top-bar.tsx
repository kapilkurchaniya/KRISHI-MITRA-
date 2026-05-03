"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MoreHorizontal } from "lucide-react"
import { LeafLogo } from "./leaf-logo"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

type Props = {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  rightSlot?: React.ReactNode
  className?: string
}

export function TopBar({ title, showBack = false, showLogo = false, rightSlot, className }: Props) {
  const router = useRouter()
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-top",
        className,
      )}
    >
      <div className="mx-auto max-w-md flex items-center gap-2 px-4 h-14">
        {showBack ? (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="-ml-2 size-9 inline-flex items-center justify-center rounded-full hover:bg-muted text-foreground"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        ) : showLogo ? (
          <Link href="/dashboard" aria-label="AI Krishi home" className="flex items-center">
            <LeafLogo size={32} withText />
          </Link>
        ) : null}

        {title ? (
          <h1 className="font-serif font-semibold text-base text-foreground truncate flex-1 text-center">
            {title}
          </h1>
        ) : (
          <div className="flex-1" />
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          {rightSlot ?? (
            <button
              aria-label="More options"
              className="size-9 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
            >
              <MoreHorizontal className="size-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
