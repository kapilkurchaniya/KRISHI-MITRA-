"use client"

import Link from "next/link"
import useSWR from "swr"
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import { useAutoLocation } from "@/lib/use-auto-location"
import type { MandiPrice } from "@/lib/types"

export function DashboardMandi() {
  const { location } = useAutoLocation()
  const url = location ? `/api/mandi?lat=${location.lat}&lon=${location.lon}&limit=3` : "/api/mandi?limit=3"
  const { data } = useSWR<{ prices: MandiPrice[] }>(url, fetcher, { revalidateOnFocus: false })
  const prices = data?.prices ?? []

  if (prices.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold">Today&apos;s mandi prices</h2>
        <Link href="/mandi" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
          View all <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {prices.slice(0, 3).map((p) => {
          const trend = p.change_pct ?? 0
          const up = trend >= 0
          return (
            <li key={`${p.crop}-${p.market}`} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium capitalize truncate">{p.crop}</div>
                <div className="text-xs text-muted-foreground truncate">{p.market}</div>
              </div>
              <div className="text-right">
                <div className="font-serif font-bold">&#8377;{p.modal_price}</div>
                <div className="text-[11px] text-muted-foreground">per quintal</div>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  up ? "text-primary" : "text-destructive"
                }`}
              >
                {up ? (
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-3.5" aria-hidden="true" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
