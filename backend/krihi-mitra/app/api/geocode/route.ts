import { NextResponse } from "next/server"

// Server-side reverse geocoding to keep the OpenWeather key private.
// Falls back to BigDataCloud's free no-key endpoint if no key is set.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get("lat"))
  const lon = Number(url.searchParams.get("lon"))
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const key = process.env.OPENWEATHER_API_KEY
  try {
    if (key) {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`,
        { cache: "no-store" },
      )
      if (res.ok) {
        const arr = (await res.json()) as Array<{
          name?: string
          state?: string
          country?: string
        }>
        const hit = arr[0]
        if (hit) {
          return NextResponse.json({
            village: hit.name ?? null,
            district: hit.state ?? null, // OWM "state" is often the locality/region in IN
            state: hit.state ?? null,
            country: hit.country ?? null,
          })
        }
      }
    }

    // Free, no-key fallback
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { cache: "no-store" },
    )
    if (!res.ok) throw new Error("reverse geocode failed")
    const data = (await res.json()) as {
      city?: string
      locality?: string
      principalSubdivision?: string
      countryName?: string
    }
    return NextResponse.json({
      village: data.locality ?? data.city ?? null,
      district: data.city ?? null,
      state: data.principalSubdivision ?? null,
      country: data.countryName ?? null,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "geocode failed" }, { status: 502 })
  }
}
