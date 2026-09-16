"use client"

import useSWR from "swr"
import Link from "next/link"
import { useState } from "react"
import { Search, TrendingUp, TrendingDown, MapPin, Loader2, Star } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { fetcher } from "@/lib/fetcher"
import { useAutoLocation } from "@/lib/use-auto-location"
import type { MandiPrice } from "@/lib/types"

export default function MandiPage() {
  const { location } = useAutoLocation()
  const [q, setQ] = useState("")
  const url = location
    ? `/api/mandi?lat=${location.lat}&lon=${location.lon}`
    : "/api/mandi"
  const { data, isLoading } = useSWR<{ prices: MandiPrice[] }>(url, fetcher, {
    revalidateOnFocus: false,
  })

  const prices = (data?.prices ?? []).filter((p) =>
    [p.crop, p.market, p.state].join(" ").toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <>
      <TopBar title="Mandi prices" showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {location
            ? [location.district, location.state].filter(Boolean).join(", ") || "Your area"
            : "Detecting location..."}
        </div>

        <div className="rounded-xl border border-border bg-card flex items-center gap-2 px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search crop or market..."
            aria-label="Search mandi prices"
            className="flex-1 bg-transparent py-2.5 outline-none text-foreground"
          />
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading mandi prices...
          </div>
        ) : prices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No prices found for that search.
          </div>
        ) : (
          <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {prices.map((p) => {
              const trend = p.change_pct ?? 0
              const up = trend >= 0
              return (
                <li key={`${p.crop}-${p.market}`}>
                  <Link
                    href={`/mandi/detail?crop=${encodeURIComponent(p.crop)}&market=${encodeURIComponent(p.market)}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium capitalize truncate">{p.crop}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {p.market} &middot; {p.state}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-bold">&#8377;{p.modal_price}</div>
                      <div className="text-[11px] text-muted-foreground">/quintal</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium w-14 justify-end ${
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
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <Link
          href="/mandi/product"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-medium text-foreground hover:bg-muted"
        >
          <Star className="size-4" aria-hidden="true" />
          Track favourite crops
        </Link>
      </div>
    </>
  )
}
