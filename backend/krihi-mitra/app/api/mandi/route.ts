import { NextResponse } from "next/server"
import { getMandiPrices, CROP_CATALOG } from "@/lib/mandi"
import type { MandiPrice } from "@/lib/types"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get("limit") ?? "20")
  const state = url.searchParams.get("state") ?? undefined
  const crop = url.searchParams.get("crop") ?? undefined

  let prices: MandiPrice[] = []

  if (crop) {
    prices = getMandiPrices(crop, state)
  } else {
    // Aggregate top prices from major crops
    const topCrops = ["wheat", "rice", "maize", "cotton", "soybean", "onion", "potato", "tomato"]
    for (const c of topCrops) {
      prices.push(...getMandiPrices(c, state).slice(0, 3))
    }
  }

  return NextResponse.json(
    { prices: prices.slice(0, limit), source: "ai-krishi-aggregator" },
    { headers: { "Cache-Control": "private, max-age=900" } },
  )
}
