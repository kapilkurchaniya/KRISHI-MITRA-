import { NextResponse } from "next/server"
import { fetchOpenWeather } from "@/lib/weather"
import type { IrrigationPlan } from "@/lib/types"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get("lat"))
  const lon = Number(url.searchParams.get("lon"))
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const forecast = await fetchOpenWeather(lat, lon)
  const humidity = forecast.current.humidity
  const days = forecast.daily.map((d) => {
    let action: "irrigate" | "skip-rain" | "monitor" = "monitor"
    let note = "Soil moisture should be sufficient."
    const expectedRainMm = Math.round((d.pop ?? 0) * 20)

    if (expectedRainMm >= 6) {
      action = "skip-rain"
      note = `Rain expected (${expectedRainMm} mm). Skip irrigation.`
    } else if (d.temp_max >= 34 && humidity < 55) {
      action = "irrigate"
      note = `Hot and dry day (${Math.round(d.temp_max)} C, ${humidity}% RH). Irrigate in early morning.`
    }

    return {
      date: d.date,
      action,
      note,
      expectedRainMm,
    }
  })

  const todayShouldIrrigate = days[0]?.action === "irrigate"
  const tomorrowRain = days[1]?.expectedRainMm ?? 0

  const plan: IrrigationPlan = {
    headline: todayShouldIrrigate
      ? "Irrigate your fields today"
      : days[0]?.action === "skip-rain"
        ? "Skip irrigation - rain incoming"
        : "No irrigation needed today",
    recommendation: todayShouldIrrigate
      ? `Apply 25-30 mm of water before 10 AM. ${tomorrowRain >= 6 ? "Light rain tomorrow may reduce next cycle." : ""}`
      : days[0]?.action === "skip-rain"
        ? `Expected rainfall of ${days[0].expectedRainMm} mm. Save your water and electricity.`
        : "Conditions look balanced. Monitor soil moisture in the afternoon.",
    shouldIrrigateToday: todayShouldIrrigate,
    days,
  }
  return NextResponse.json(plan, { headers: { "Cache-Control": "private, max-age=600" } })
}
