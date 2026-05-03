"use client"

import useSWR from "swr"
import { useState } from "react"
import { Star, Plus, Trash2, Loader2 } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { fetcher } from "@/lib/fetcher"
import { COMMON_CROPS } from "@/lib/constants"

type Favorite = { id: string; crop: string; created_at: string }

export default function MandiFavoritesPage() {
  const { data, isLoading, mutate } = useSWR<{ favorites: Favorite[] }>("/api/mandi/favorites", fetcher, {
    revalidateOnFocus: false,
  })
  const [adding, setAdding] = useState("")
  const [busy, setBusy] = useState(false)

  async function add() {
    if (!adding) return
    setBusy(true)
    try {
      await fetch("/api/mandi/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop: adding }),
      })
      setAdding("")
      mutate()
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    await fetch(`/api/mandi/favorites?id=${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <>
      <TopBar title="Favourite crops" showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <select
              value={adding}
              onChange={(e) => setAdding(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-card py-2.5 px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Pick a crop to track...</option>
              {COMMON_CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={add}
              disabled={!adding || busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 font-medium disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
              Add
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading favourites...
          </div>
        ) : !data?.favorites || data.favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No favourites yet. Add a crop to get daily price alerts.
          </div>
        ) : (
          <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {data.favorites.map((f) => (
              <li key={f.id} className="px-4 py-3 flex items-center gap-3">
                <span className="size-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Star className="size-4" aria-hidden="true" />
                </span>
                <div className="flex-1 font-medium">{f.crop}</div>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  aria-label={`Remove ${f.crop}`}
                  className="size-9 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
