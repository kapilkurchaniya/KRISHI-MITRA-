import Link from "next/link"
import { WifiOff } from "lucide-react"

export const metadata = { title: "Offline" }

export default function OfflinePage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-sm text-center flex flex-col items-center gap-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <WifiOff className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-balance">You&apos;re offline</h1>
        <p className="text-muted-foreground text-pretty leading-relaxed">
          AI Krishi works offline for cached pages. Reconnect to scan plants, fetch weather and live mandi prices.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-sm hover:opacity-90"
        >
          Try again
        </Link>
      </div>
    </main>
  )
}
