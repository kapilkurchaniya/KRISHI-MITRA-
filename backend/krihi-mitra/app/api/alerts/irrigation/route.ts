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
  const days = forecast.daily.map((d) => {
    let action: "irrigate" | "skip-rain" | "monitor" = "monitor"
    let note = "Soil moisture should be sufficient."
    if (d.rainMm >= 6) {
      action = "skip-rain"
      note = `Rain expected (${d.rainMm} mm). Skip irrigation.`
    } else if (d.tempMax >= 34 && d.humidity < 55) {
      action = "irrigate"
      note = `Hot and dry day (${Math.round(d.tempMax)}°C, ${d.humidity}% RH). Irrigate in early morning.`
    }
    return {
      date: d.date,
      action,
      note,
      expectedRainMm: d.rainMm,
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
