import { NextResponse } from "next/server"
import { getMandiPrices, getCropMeta } from "@/lib/mandi"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const crop = url.searchParams.get("crop")
  const market = url.searchParams.get("market")
  if (!crop || !market) {
    return NextResponse.json({ error: "crop and market are required" }, { status: 400 })
  }
  
  const prices = getMandiPrices(crop)
  const detail = prices.find((p) => p.market === market)
  const cropMeta = getCropMeta(crop)
  
  if (!detail) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 })
  }
  
  return NextResponse.json(
    { ...detail, cropMeta },
    { headers: { "Cache-Control": "private, max-age=900" } },
  )
}
