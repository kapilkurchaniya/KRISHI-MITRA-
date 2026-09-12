"use client"

import useSWR from "swr"
import Link from "next/link"
import { CloudSun, Droplets, Wind, Cloud, Loader2, AlertCircle } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { useAutoLocation } from "@/lib/use-auto-location"
import type { WeatherForecast } from "@/lib/types"

export function DashboardWeather() {
  const { location, loading: locLoading } = useAutoLocation()
  const url = location ? `/api/weather?lat=${location.lat}&lon=${location.lon}` : null
  const { data, isLoading, error } = useSWR<WeatherForecast>(url, fetcher, { 
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    dedupingInterval: 600,
  })

  const today = data?.daily?.[0]
  const current = data?.current
  const isError = error || (!isLoading && !today && url)

  return (
    <Link
      href="/weather"
      className="rounded-2xl border border-border bg-gradient-to-br from-primary/95 to-primary text-primary-foreground p-5 flex flex-col gap-3 hover:shadow-lg hover:from-primary hover:to-primary/90 transition-all"
    >
      {/* Header with Location */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider opacity-80 font-medium">Today&apos;s weather</div>
          <div className="text-[11px] opacity-75 mt-0.5">{data?.location?.name || "Your area"}</div>
        </div>
        <div className="size-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm">
          {isLoading || locLoading ? (
            <Loader2 className="size-5 animate-spin opacity-80" aria-hidden="true" />
          ) : isError ? (
            <AlertCircle className="size-5 opacity-80" aria-hidden="true" />
          ) : (
            <CloudSun className="size-5" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Temperature and Condition */}
      <div>
        {isLoading || locLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin opacity-80" aria-hidden="true" />
            <span className="text-sm opacity-90">Loading...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 opacity-80" aria-hidden="true" />
            <span className="text-sm opacity-90">Unavailable</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold font-serif">{Math.round(current?.temp ?? 0)}&deg;C</div>
            <div className="text-sm capitalize opacity-90 leading-tight">{current?.conditions || "Clear"}</div>
          </div>
        )}
      </div>

      {/* Conditions Row */}
      {data && !isError ? (
        <div className="flex items-center justify-between text-[11px] opacity-90 pt-1 border-t border-primary-foreground/20">
          <div className="flex items-center gap-1.5">
            <Droplets className="size-3.5" aria-hidden="true" />
            <span>{current?.humidity ?? 0}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="size-3.5" aria-hidden="true" />
            <span>{Math.round(current?.wind_speed ?? 0)} km/h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cloud className="size-3.5" aria-hidden="true" />
            <span>{Math.round(today?.temp_max ?? 0)}&deg;</span>
          </div>
        </div>
      ) : null}
    </Link>
  )
}
