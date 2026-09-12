"use client"

import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { TrendingUp, TrendingDown, Loader2, MessageCircle } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { fetcher } from "@/lib/fetcher"
import type { MandiDetail } from "@/lib/types"

export default function MandiDetailPage() {
  const params = useSearchParams()
  const crop = params.get("crop") || ""
  const market = params.get("market") || ""
  const url = crop && market ? `/api/mandi/detail?crop=${encodeURIComponent(crop)}&market=${encodeURIComponent(market)}` : null
  const { data, isLoading } = useSWR<MandiDetail>(url, fetcher, { revalidateOnFocus: false })

  return (
    <>
      <TopBar title={crop || "Mandi"} showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        {isLoading || !data ? (
          <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading...
          </div>
        ) : (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
              <div className="text-xs uppercase tracking-wider opacity-80">{data.market}</div>
              <h2 className="font-serif text-2xl font-bold">{data.crop}</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="font-serif text-4xl font-bold">&#8377;{data.modalPrice}</div>
                <div className="text-sm opacity-90">/quintal</div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs opacity-90">
                <span>Min &#8377;{data.minPrice}</span>
                <span>&middot;</span>
                <span>Max &#8377;{data.maxPrice}</span>
              </div>
              <div
                className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${
                  (data.changePct ?? 0) >= 0 ? "text-primary-foreground" : "text-destructive-foreground"
                }`}
              >
                {(data.changePct ?? 0) >= 0 ? (
                  <TrendingUp className="size-4" aria-hidden="true" />
                ) : (
                  <TrendingDown className="size-4" aria-hidden="true" />
                )}
                {Math.abs(data.changePct ?? 0).toFixed(1)}% vs yesterday
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">14-day price trend</h3>
              <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
                {data.history.map((h) => (
                  <li key={h.date} className="px-4 py-2.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(h.date).toLocaleDateString()}
                    </span>
                    <span className="font-semibold">&#8377;{h.price}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href={`/mitra?topic=${encodeURIComponent(data.crop + " price prediction")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-3 font-semibold"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Predict price with Krishi Mitra
            </Link>
          </>
        )}
      </div>
    </>
  )
}
