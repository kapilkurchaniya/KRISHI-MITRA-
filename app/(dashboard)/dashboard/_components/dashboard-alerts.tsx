"use client"

import Link from "next/link"
import useSWR from "swr"
import { Bell, ArrowRight } from "lucide-react"
import { fetcher } from "@/lib/fetcher"
import type { Alert } from "@/lib/types"

export function DashboardAlerts() {
  const { data } = useSWR<{ alerts: Alert[] }>("/api/alerts?limit=2", fetcher, { revalidateOnFocus: false })
  const alerts = data?.alerts ?? []

  if (alerts.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold">Latest alerts</h2>
        <Link href="/alerts" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
          View all <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="rounded-xl border border-border bg-card p-3 flex items-start gap-3"
          >
            <span className="mt-0.5 size-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <Bell className="size-4" aria-hidden="true" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{a.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{a.message}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
