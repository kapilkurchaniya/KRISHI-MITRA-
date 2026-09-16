import Link from "next/link"
import { Bell, Droplets, CloudRain, Bug, Sprout, TrendingUp, ArrowRight } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"

type AlertItem = {
  id: string
  title: string
  message: string
  severity?: string
  kind?: string
  type?: string
  created_at: string
}

const DUMMY_ALERTS: AlertItem[] = [
  {
    id: "demo-1",
    title: "Heavy rain expected tomorrow",
    message: "Rainfall of 25-40mm forecasted in your district. Postpone irrigation and protect harvested crops.",
    severity: "high",
    kind: "weather",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "demo-2",
    title: "Pest alert: Brown plant hopper",
    message: "BPH infestations reported in nearby paddy fields. Inspect crops and consider IPM measures.",
    severity: "medium",
    kind: "pest",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "demo-3",
    title: "Irrigation scheduled for tomorrow",
    message: "Based on soil moisture and forecast, irrigate field A tomorrow morning. Approx 25mm water needed.",
    severity: "low",
    kind: "irrigation",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "demo-4",
    title: "PM-KISAN installment released",
    message: "Rs 2,000 has been credited to eligible farmer accounts under PM-KISAN scheme. Check your bank statement.",
    severity: "low",
    kind: "crop",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-5",
    title: "Mandi prices: Wheat up 5%",
    message: "Wheat modal price rose to Rs 2,250/quintal in nearby mandis. Good time to sell stored grain.",
    severity: "low",
    kind: "market",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
]

const iconFor: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  weather: CloudRain,
  irrigation: Droplets,
  pest: Bug,
  crop: Sprout,
  market: TrendingUp,
}

const toneFor: Record<string, string> = {
  weather: "bg-accent/15 text-accent",
  irrigation: "bg-primary/10 text-primary",
  pest: "bg-destructive/10 text-destructive",
  crop: "bg-secondary text-secondary-foreground",
  market: "bg-primary/10 text-primary",
}

export default async function AlertsPage() {
  let alerts: AlertItem[] = []

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(40)
      alerts = (alertsData ?? []) as AlertItem[]
    }
  } catch (error) {
    console.error('[v0] Alerts page error:', error)
  }

  // Show dummy alerts if user has none yet
  const list = alerts.length > 0 ? alerts : DUMMY_ALERTS

  return (
    <>
      <TopBar title="Alerts" showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/alerts/irrigation"
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Droplets className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <div className="font-semibold text-sm">Irrigation plan</div>
              <div className="text-[11px] text-muted-foreground">Smart schedule</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>
          <Link
            href="/mitra"
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <span className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Bell className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <div className="font-semibold text-sm">Ask AI</div>
              <div className="text-[11px] text-muted-foreground">Custom advice</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
            <div className="mx-auto size-12 rounded-xl bg-muted flex items-center justify-center mb-2">
              <Bell className="size-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="font-medium">No alerts right now</p>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll notify you about weather, pests and irrigation needs.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.map((a) => {
              const kind = a.kind || a.type || "general"
              const Icon = iconFor[kind] ?? Bell
              const tone = toneFor[kind] ?? "bg-muted text-foreground"
              return (
                <li key={a.id} className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
                  <span className={`mt-0.5 size-10 rounded-xl flex items-center justify-center ${tone}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{a.message}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {new Date(a.created_at).toLocaleString()}
                    </div>
                  </div>
                  {a.severity ? (
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        a.severity === "high" || a.severity === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : a.severity === "medium" || a.severity === "warning"
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-foreground"
                      }`}
                    >
                      {a.severity}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
