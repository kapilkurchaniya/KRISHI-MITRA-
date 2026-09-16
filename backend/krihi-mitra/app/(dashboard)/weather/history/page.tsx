import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"
import { CloudRain, Sun } from "lucide-react"

export default async function WeatherHistoryPage() {
  let logs = []

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: logsData } = await supabase
        .from("weather_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(60)
      logs = logsData ?? []
    }
  } catch (error) {
    console.error('[v0] Weather history error:', error)
  }

  return (
    <>
      <TopBar title="Weather history" showBack />
      <div className="px-4 pt-4">
        {!logs || logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No weather logs yet. We&apos;ll start saving snapshots as you check the forecast.
          </div>
        ) : (
          <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {logs.map((l) => (
              <li key={l.id} className="px-4 py-3 flex items-center gap-3">
                <span className="size-9 rounded-lg bg-muted flex items-center justify-center">
                  {l.rain_mm > 0 ? (
                    <CloudRain className="size-4" aria-hidden="true" />
                  ) : (
                    <Sun className="size-4" aria-hidden="true" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {new Date(l.logged_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground truncate capitalize">{l.summary}</div>
                </div>
                <div className="text-sm font-semibold">{Math.round(l.temp_c)}&deg;C</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
