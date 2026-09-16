import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchOpenWeather } from "@/lib/weather"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get("lat"))
  const lon = Number(url.searchParams.get("lon"))
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const forecast = await fetchOpenWeather(lat, lon)

  // Best-effort log to weather_logs (RLS enforces user_id)
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("weather_logs").insert({
        user_id: user.id,
        latitude: lat,
        longitude: lon,
        location_name: forecast.location?.name || "Current Location",
        temperature: forecast.current.temp,
        humidity: forecast.current.humidity,
        wind_speed: forecast.current.wind_speed,
        conditions: forecast.current.conditions,
        raw: forecast,
      })
    }
  } catch (error) {
    console.error("[v0] Weather logging error:", error)
    // logging is best-effort
  }

  return NextResponse.json(forecast, {
    headers: { "Cache-Control": "private, max-age=600" },
  })
}
