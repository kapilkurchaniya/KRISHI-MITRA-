"use client"

import useSWR from "swr"
import { Droplets, CloudRain, Sun, Loader2 } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { StatusBanner } from "@/components/ui/status-banner"
import { fetcher } from "@/lib/fetcher"
import { useAutoLocation } from "@/lib/use-auto-location"
import type { IrrigationPlan } from "@/lib/types"

export default function IrrigationPage() {
  const { location } = useAutoLocation()
  const url = location ? `/api/alerts/irrigation?lat=${location.lat}&lon=${location.lon}` : null
  const { data, isLoading } = useSWR<IrrigationPlan>(url, fetcher, { revalidateOnFocus: false })

  return (
    <>
      <TopBar title="Irrigation plan" showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        {isLoading || !data ? (
          <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Generating plan...
          </div>
        ) : (
          <>
            <StatusBanner variant={data.shouldIrrigateToday ? "warning" : "success"} title={data.headline}>
              {data.recommendation}
            </StatusBanner>

            <section>
              <h2 className="font-serif text-lg font-bold mb-2">7-day irrigation plan</h2>
              <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                {data.days.map((d) => (
                  <li key={d.date} className="px-4 py-3 flex items-center gap-3">
                    <span
                      className={`size-9 rounded-lg flex items-center justify-center ${
                        d.action === "irrigate"
                          ? "bg-primary/10 text-primary"
                          : d.action === "skip-rain"
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-foreground"
                      }`}
                    >
                      {d.action === "skip-rain" ? (
                        <CloudRain className="size-4" aria-hidden="true" />
                      ) : d.action === "irrigate" ? (
                        <Droplets className="size-4" aria-hidden="true" />
                      ) : (
                        <Sun className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">{d.note}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{d.expectedRainMm} mm</div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </>
  )
}
