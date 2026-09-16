import Link from "next/link"
import { ScanLine, CloudSun, IndianRupee, Bell, Sparkles, ArrowRight, ShieldCheck, Globe2 } from "lucide-react"
import { LeafLogo } from "@/components/ui/leaf-logo"
import { InstallButton } from "@/components/pwa/install-button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  // Try to check if user is logged in, but don't fail if Supabase isn't configured
  let user = null
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    // Supabase not configured, continue without auth check
  }

  if (user) redirect("/dashboard")

  const features = [
    {
      icon: ScanLine,
      title: "Plant disease scanner",
      desc: "Snap a leaf and get instant AI diagnosis with treatment steps.",
    },
    {
      icon: CloudSun,
      title: "Hyperlocal weather",
      desc: "7-day forecasts auto-tuned to your village coordinates.",
    },
    {
      icon: IndianRupee,
      title: "Live mandi prices",
      desc: "Daily prices from nearby mandis with trend insights.",
    },
    {
      icon: Bell,
      title: "Smart irrigation alerts",
      desc: "Be the first to know about rain, heat or pest outbreaks.",
    },
    {
      icon: Sparkles,
      title: "Krishi Mitra AI",
      desc: "Voice + text answers in your language, available 24/7.",
    },
    {
      icon: ShieldCheck,
      title: "Private and secure",
      desc: "Your farm data is encrypted and never sold.",
    },
  ]

  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur safe-area-top">
        <div className="mx-auto max-w-md flex items-center justify-between px-4 h-14">
          <LeafLogo className="size-6" />
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-4xl font-bold leading-tight text-balance">
            Smart farming, powered by AI
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            AI Krishi helps Indian farmers make smarter decisions about crops, weather, and markets. Get instant disease diagnosis, hyperlocal forecasts, and live mandi prices.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
            <InstallButton />
          </div>
          <p className="text-xs text-muted-foreground">
            Free forever for individual farmers. No credit card required.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-lg overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-primary/5 aspect-square flex flex-col items-center justify-center p-3 gap-2 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Crop scan"
                  className="size-6"
                />
              </div>
              <span className="text-xs font-medium text-center text-foreground">Crop Scan</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border bg-gradient-to-br from-accent/10 to-accent/5 aspect-square flex flex-col items-center justify-center p-3 gap-2 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Weather forecast"
                  className="size-6"
                />
              </div>
              <span className="text-xs font-medium text-center text-foreground">Weather</span>
            </div>
            <div className="rounded-lg overflow-hidden border border-border bg-gradient-to-br from-secondary/10 to-secondary/5 aspect-square flex flex-col items-center justify-center p-3 gap-2 hover:shadow-md transition-shadow">
              <div className="size-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Mandi prices"
                  className="size-6"
                />
              </div>
              <span className="text-xs font-medium text-center text-foreground">Prices</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl overflow-hidden">
            <img
              src="/farmer-app.png"
              alt="Farmer happily using AI Krishi on a smartphone in a paddy field"
              className="w-full h-auto rounded-xl object-cover"
            />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "98%", v: "Accuracy" },
                { k: "24/7", v: "AI help" },
                { k: "12+", v: "Languages" },
              ].map((s) => (
                <div key={s.v} className="rounded-lg bg-muted/60 p-2.5 text-center">
                  <div className="font-serif font-bold text-base text-foreground">{s.k}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl font-bold text-balance">
            Everything you need.
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-4 active:bg-muted transition-colors"
              >
                <div className="flex gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <f.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground mb-0.5">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-lg font-bold">Built for farmers</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: "Private & secure" },
              { icon: Globe2, label: "Works offline" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <item.icon className="size-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex-1"
            >
              Create account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Questions?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-border mt-8 py-6 px-4">
        <div className="mx-auto max-w-md text-center text-xs text-muted-foreground">
          <p>© 2026 AI Krishi. Built for Indian farmers.</p>
        </div>
      </footer>
    </main>
  )
}
