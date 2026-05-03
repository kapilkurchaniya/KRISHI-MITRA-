import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageSquare, ArrowLeft, Globe2 } from "lucide-react"
import { LeafLogo } from "@/components/ui/leaf-logo"
import { ContactForm } from "./_components/contact-form"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the AI Krishi team for support, partnerships and feedback.",
}

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur safe-area-top">
        <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
          <Link href="/" aria-label="Home" className="inline-flex items-center gap-1.5 text-sm hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <LeafLogo size={24} />
          </Link>
          <Link
            href="/auth/login"
            className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-md px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium ring-1 ring-primary/20">
            <MessageSquare className="size-3" aria-hidden="true" />
            24-hour reply time
          </span>
          <h1 className="font-serif text-2xl font-bold leading-tight text-balance">
            Contact us
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions about crops, partnerships, or features? We&apos;d love to hear from you.
            from you.
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            <li className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
              <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <a href="mailto:hello@aikrishi.app" className="font-medium hover:underline">
                  hello@aikrishi.app
                </a>
              </div>
            </li>
            <li className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
              <span className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Helpline (Mon-Sat, 9 AM - 7 PM IST)</div>
                <a href="tel:+918000000000" className="font-medium hover:underline">
                  +91 80000 00000
                </a>
              </div>
            </li>
            <li className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
              <span className="size-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Office</div>
                <div className="font-medium">Bengaluru, Karnataka, India</div>
              </div>
            </li>
            <li className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
              <span className="size-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                <Globe2 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">Languages supported</div>
                <div className="font-medium">12+ Indian languages</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
          <h2 className="font-serif text-xl font-bold mb-4">Send us a message</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
