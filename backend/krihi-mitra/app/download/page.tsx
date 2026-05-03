import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Smartphone, Apple, Globe2, ShieldCheck, Wifi } from "lucide-react"
import { LeafLogo } from "@/components/ui/leaf-logo"
import { InstallButton } from "@/components/pwa/install-button"

export const metadata: Metadata = {
  title: "Download AI Krishi",
  description: "Install AI Krishi on Android, iPhone and the web. Free, lightweight and offline-capable.",
}

const APK_URL = process.env.NEXT_PUBLIC_APK_URL || ""
const PLAY_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || ""
const APPSTORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || ""

export default function DownloadPage() {
  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur safe-area-top">
        <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
          <Link href="/" aria-label="Home" className="inline-flex items-center gap-1.5 text-sm hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <LeafLogo size={24} />
          </Link>
          <Link href="/contact" className="text-xs px-3 py-1.5 rounded-full hover:bg-muted transition-colors">
            Contact
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col items-start gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium ring-1 ring-primary/20">
            <Smartphone className="size-3" aria-hidden="true" />
            Available now
          </span>
          <h1 className="font-serif text-3xl font-bold leading-tight text-balance">
            Get AI Krishi on your phone
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Free app available on Android, iPhone, and web. Works offline on all devices.
            One install, three ways: install our blazing-fast progressive web app, sideload the Android APK, or wait
            for the official store listings.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* PWA install */}
          <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Globe2 className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">Install web app</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Works on Android, iPhone and desktop. No store, no waiting. Updates automatically.
              </p>
            </div>
            <InstallButton fullWidth />
            <ul className="text-xs text-muted-foreground flex flex-col gap-1 mt-1">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" /> 0 KB on the home screen
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Wifi className="size-3.5 text-primary" aria-hidden="true" /> Works offline
              </li>
            </ul>
          </article>

          {/* Android APK */}
          <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <div className="size-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Smartphone className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">Android APK</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download the Capacitor-built APK directly. Best for areas with patchy internet.
              </p>
            </div>
            {APK_URL ? (
              <a
                href={APK_URL}
                download
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-sm hover:opacity-95"
              >
                Download APK
              </a>
            ) : PLAY_URL ? (
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-sm hover:opacity-95"
              >
                Open Play Store
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-full bg-muted text-muted-foreground px-5 py-3 text-sm font-medium cursor-not-allowed"
              >
                APK coming soon
              </button>
            )}
            <p className="text-xs text-muted-foreground">
              Build instructions are in <code className="font-mono text-[11px]">README-ANDROID.md</code>.
            </p>
          </article>

          {/* iOS */}
          <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
            <div className="size-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <Apple className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">iPhone &amp; iPad</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add AI Krishi to your home screen with full offline support &mdash; no App Store needed.
              </p>
            </div>
            {APPSTORE_URL ? (
              <a
                href={APPSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-sm hover:opacity-95"
              >
                Open App Store
              </a>
            ) : (
              <a
                href="#install-ios-instructions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-card border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                See install steps
              </a>
            )}
          </article>
        </div>

        <section
          id="install-ios-instructions"
          className="mt-10 rounded-3xl bg-card border border-border p-6 sm:p-8"
        >
          <h2 className="font-serif text-2xl font-bold mb-2">Install on iPhone in 3 steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed text-foreground">
            <li>
              Open this page in <span className="font-medium">Safari</span> on your iPhone.
            </li>
            <li>
              Tap the <span className="font-medium">Share</span> icon, then{" "}
              <span className="font-medium">Add to Home Screen</span>.
            </li>
            <li>
              Tap <span className="font-medium">Add</span> &mdash; AI Krishi will appear like a regular app.
            </li>
          </ol>
        </section>
      </section>
    </main>
  )
}
