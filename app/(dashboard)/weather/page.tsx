"use client"

import useSWR from "swr"
import Link from "next/link"
import { CloudSun, Droplets, Wind, Sun, CloudRain, MapPin, History, Loader2, RefreshCw } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { StatusBanner } from "@/components/ui/status-banner"
import { fetcher } from "@/lib/fetcher"
import { useAutoLocation } from "@/lib/use-auto-location"
import type { WeatherForecast } from "@/lib/types"

export default function WeatherPage() {
  const { location, loading: locLoading, error: locError } = useAutoLocation()
  const url = location ? `/api/weather?lat=${location.lat}&lon=${location.lon}` : null
  const { data, isLoading, error, mutate } = useSWR<WeatherForecast>(url, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 1000 * 60 * 30, // 30 min
  })

  return (
    <>
      <TopBar
        title="Weather"
        showBack
        rightSlot={
          <button
            type="button"
            onClick={() => mutate()}
            aria-label="Refresh weather"
            className="size-9 inline-flex items-center justify-center rounded-full hover:bg-muted text-foreground"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
          </button>
        }
      />
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {location
            ? [location.village, location.district, location.state].filter(Boolean).join(", ") ||
              `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`
            : "Detecting location..."}
        </div>

        {locError ? <StatusBanner variant="warning">{locError}</StatusBanner> : null}
        {error ? <StatusBanner variant="error">Could not load forecast.</StatusBanner> : null}

        {!data || isLoading || locLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading hyperlocal forecast...
          </div>
        ) : (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Right now</div>
                  <div className="font-serif text-5xl font-bold">{Math.round(data.current.temp)}&deg;C</div>
                  <div className="text-sm capitalize mt-1 opacity-90">{data.current.conditions}</div>
                </div>
                <div className="size-16 rounded-2xl bg-primary-foreground/15 flex items-center justify-center">
                  <CloudSun className="size-8" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl bg-primary-foreground/10 p-3">
                  <div className="flex items-center gap-1 opacity-80 text-xs">
                    <Droplets className="size-3" aria-hidden="true" />
                    Humidity
                  </div>
                  <div className="font-semibold">{data.current.humidity}%</div>
                </div>
                <div className="rounded-xl bg-primary-foreground/10 p-3">
                  <div className="flex items-center gap-1 opacity-80 text-xs">
                    <Wind className="size-3" aria-hidden="true" />
                    Wind
                  </div>
                  <div className="font-semibold">{Math.round(data.current.wind_speed)} km/h</div>
                </div>
                <div className="rounded-xl bg-primary-foreground/10 p-3">
                  <div className="flex items-center gap-1 opacity-80 text-xs">
                    <Sun className="size-3" aria-hidden="true" />
                    Conditions
                  </div>
                  <div className="font-semibold capitalize">{data.current.conditions}</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold mb-2">7-day forecast</h2>
              <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                {data.daily.map((d) => (
                  <li key={d.date} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-12 text-sm font-medium">
                      {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <span className="size-9 rounded-lg bg-muted flex items-center justify-center text-foreground">
                      {d.pop > 0.3 ? (
                        <CloudRain className="size-4" aria-hidden="true" />
                      ) : (
                        <Sun className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="flex-1 text-sm capitalize text-muted-foreground truncate">{d.conditions}</div>
                    <div className="text-xs text-muted-foreground w-10 text-right">
                      {Math.round(d.temp_min)}&deg;
                    </div>
                    <div className="text-sm font-semibold w-10 text-right">{Math.round(d.temp_max)}&deg;</div>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href="/weather/history"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-medium text-foreground hover:bg-muted"
            >
              <History className="size-4" aria-hidden="true" />
              View weather history
            </Link>
          </>
        )}
      </div>
    </>
  )
}
