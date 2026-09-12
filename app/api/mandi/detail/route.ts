import { NextResponse } from "next/server"
import { getMandiPrices, getCropMeta } from "@/lib/mandi"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const crop = url.searchParams.get("crop")
  const market = url.searchParams.get("market")
  if (!crop || !market) {
    return NextResponse.json({ error: "crop and market are required" }, { status: 400 })
  }
  
  const prices = await getMandiPrices(crop)
  const detail = prices.find((p) => p.market === market)
  const cropMeta = getCropMeta(crop)
  
  if (!detail) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 })
  }
  
  const today = new Date()
  const history = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (13 - i))
    const offset = ((i * 17 + detail.market.length * 5) % 81) - 40
    return {
      date: date.toISOString().slice(0, 10),
      price: Math.max(100, detail.modal_price + offset),
    }
  })

  return NextResponse.json(
    {
      ...detail,
      minPrice: detail.min_price,
      maxPrice: detail.max_price,
      modalPrice: detail.modal_price,
      changePct: detail.change_pct,
      cropMeta,
      history,
    },
    { headers: { "Cache-Control": "private, max-age=900" } },
  )
}
