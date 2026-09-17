"use client"

import Link from "next/link"
import { ScanLine, CloudSun, IndianRupee, Bell, Sparkles, MapPin, ArrowRight, Sprout } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { t as translate } from "@/lib/translations"

interface Profile {
  full_name: string | null
  village: string | null
  district: string | null
  state: string | null
  primary_crops: string[] | null
}

interface DashboardContentProps {
  profile: Profile | null
  children: React.ReactNode
}

export function DashboardContent({ profile, children }: DashboardContentProps) {
  const { language } = useLanguage()
  const t = (key: string) => translate(key, language as "en" | "hi")

  const firstName = profile?.full_name?.split(" ")[0] || (language === "hi" ? "किसान" : "Farmer")
  const placeLabel = [profile?.village, profile?.district].filter(Boolean).join(", ") || "your village"

  const quickActions = [
    { href: "/crop-scanner", label: t("dashboard.scanner"), icon: ScanLine, tone: "bg-primary/10 text-primary" },
    { href: "/weather", label: t("dashboard.weather"), icon: CloudSun, tone: "bg-accent/15 text-accent" },
    { href: "/mandi", label: t("dashboard.mandi"), icon: IndianRupee, tone: "bg-secondary text-secondary-foreground" },
    { href: "/alerts", label: t("dashboard.alerts"), icon: Bell, tone: "bg-destructive/10 text-destructive" },
  ]

  return (
    <div className="flex flex-col gap-5 md:gap-8 lg:gap-10">
      <section className="flex flex-col gap-1 md:gap-2">
        <p className="text-sm text-muted-foreground">{language === "hi" ? "नमस्ते," : "Namaste,"}</p>
        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-balance">{firstName}</h1>
        <p className="text-xs md:text-sm text-muted-foreground inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 md:size-4" aria-hidden="true" />
          {placeLabel}
        </p>
      </section>

      <section aria-label="Quick actions" className="grid grid-cols-4 sm:flex gap-3 md:gap-6 lg:gap-8">
        {quickActions.map(({ href, label, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 hover:shadow-md active:scale-95 transition-all duration-200 sm:w-28 lg:w-36 lg:py-4"
          >
            <span className={`size-10 lg:size-12 rounded-xl ${tone} flex items-center justify-center`}>
              <Icon className="size-5 lg:size-6" aria-hidden="true" />
            </span>
            <span className="text-[11px] lg:text-sm font-medium text-foreground text-center px-1 leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {children}
      </div>
      <Link
        href="/mitra"
        className="rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground p-5 flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all duration-200"
      >
        <div className="size-12 rounded-xl bg-accent-foreground/15 flex items-center justify-center">
          <Sparkles className="size-6" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">
            {language === "hi" ? "कृषि मित्र से पूछें" : "Ask Krishi Mitra AI"}
          </div>
          <div className="text-xs opacity-90">
            {language === "hi"
              ? "फसलों, कीटों, मौसम के बारे में तुरंत जवाब पाएं..."
              : "Get instant answers about crops, pests, weather..."}
          </div>
        </div>
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>

      {profile?.primary_crops && profile.primary_crops.length > 0 ? (
        <section className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sprout className="size-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">
              {language === "hi" ? "आपकी फसल को ट्रैक कर रहे हैं" : "Tracking your crop"}
            </div>
            <div className="font-semibold">{profile.primary_crops[0]}</div>
          </div>
          <Link
            href="/crop-scanner"
            className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
          >
            {language === "hi" ? "अभी स्कैन करें" : "Scan now"}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </div>
  )
}
