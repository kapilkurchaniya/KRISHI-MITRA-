"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

export function MitraFab() {
  return (
    <Link
      href="/mitra"
      aria-label="Open Krishi Mitra AI assistant"
      className="fixed right-4 bottom-20 z-30 group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground shadow-lg ring-1 ring-accent/40 px-4 py-3 hover:scale-[1.02] active:scale-[0.99] transition-transform"
    >
      <Sparkles className="size-4" aria-hidden="true" />
      <span className="font-medium text-sm">Krishi Mitra</span>
    </Link>
  )
}
