"use client"

import { useEffect, useState } from "react"
import { Download, CheckCircle2, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type Props = {
  className?: string
  variant?: "primary" | "outline"
  fullWidth?: boolean
  label?: string
}

export function InstallButton({
  className,
  variant = "primary",
  fullWidth = false,
  label = "Install app",
}: Props) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const ua = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS Safari
        window.navigator.standalone === true,
    )

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  const baseCls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-sm transition-colors",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-95"
      : "bg-card text-foreground border border-border hover:bg-muted",
    fullWidth && "w-full",
    className,
  )

  if (installed || isStandalone) {
    return (
      <span className={cn(baseCls, "cursor-default")}>
        <CheckCircle2 className="size-4" aria-hidden="true" />
        App installed
      </span>
    )
  }

  if (isIOS && !deferred) {
    return (
      <a
        href="#install-ios-instructions"
        className={baseCls}
        aria-label="View iOS install instructions"
      >
        <Smartphone className="size-4" aria-hidden="true" />
        Install on iPhone
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={!deferred}
      onClick={async () => {
        if (!deferred) return
        await deferred.prompt()
        const choice = await deferred.userChoice
        if (choice.outcome === "accepted") setInstalled(true)
        setDeferred(null)
      }}
      className={cn(baseCls, !deferred && "opacity-60 cursor-not-allowed")}
      aria-label={label}
    >
      <Download className="size-4" aria-hidden="true" />
      {deferred ? label : "Open in supported browser"}
    </button>
  )
}
