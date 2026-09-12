import type { WeatherForecast } from "./types"

const OWM_BASE = "https://api.openweathermap.org"

export async function fetchOpenWeather(lat: number, lon: number): Promise<WeatherForecast> {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    return mockForecast(lat, lon)
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${OWM_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`, {
        next: { revalidate: 600 },
      }),
      fetch(`${OWM_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`, {
        next: { revalidate: 1800 },
      }),
    ])

    if (!currentRes.ok || !forecastRes.ok) return mockForecast(lat, lon)

    const current = await currentRes.json()
    const forecast = await forecastRes.json()

    // OpenWeather "forecast" returns 3-hour intervals — group into days
    const byDay = new Map<string, any[]>()
    for (const item of forecast.list || []) {
      const day = item.dt_txt?.split(" ")[0]
      if (!day) continue
      const arr = byDay.get(day) || []
      arr.push(item)
      byDay.set(day, arr)
    }

    const daily = Array.from(byDay.entries())
      .slice(0, 7)
      .map(([date, items]) => {
        const temps = items.map((i: any) => i.main.temp)
        const pops = items.map((i: any) => i.pop ?? 0)
        const mid = items[Math.floor(items.length / 2)] ?? items[0]
        return {
          date,
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          conditions: mid.weather?.[0]?.main ?? "Clear",
          icon: mid.weather?.[0]?.icon ?? "01d",
          description: mid.weather?.[0]?.description ?? "",
          pop: Math.max(...pops),
        }
      })

    return {
      location: {
        name: current.name || forecast.city?.name || "Your area",
        lat,
        lon,
        country: current.sys?.country,
      },
      current: {
        temp: current.main.temp,
        feels_like: current.main.feels_like,
        humidity: current.main.humidity,
        wind_speed: current.wind?.speed ?? 0,
        conditions: current.weather?.[0]?.main ?? "Clear",
        icon: current.weather?.[0]?.icon ?? "01d",
        description: current.weather?.[0]?.description ?? "",
      },
      daily,
    }
  } catch (error) {
    console.error("[v0] Weather fetch error:", error)
    return mockForecast(lat, lon)
  }
}

export async function reverseGeocodeOpenWeather(lat: number, lon: number) {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    return { city: "Your area", state: "", country: "IN", formatted: "Your area" }
  }
  try {
    const res = await fetch(`${OWM_BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) throw new Error("geo failed")
    const data = await res.json()
    const top = Array.isArray(data) ? data[0] : null
    if (!top) throw new Error("no result")
    return {
      city: top.name,
      state: top.state,
      country: top.country,
      formatted: [top.name, top.state, top.country].filter(Boolean).join(", "),
    }
  } catch {
    return { city: "Your area", state: "", country: "IN", formatted: "Your area" }
  }
}

function mockForecast(lat: number, lon: number): WeatherForecast {
  const today = new Date()
  return {
    location: { name: "Your area", lat, lon, country: "IN" },
    current: {
      temp: 28,
      feels_like: 31,
      humidity: 68,
      wind_speed: 3.2,
      conditions: "Clouds",
      icon: "03d",
      description: "scattered clouds",
    },
    daily: Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const seed = (i * 7) % 5
      return {
        date: d.toISOString().slice(0, 10),
        temp_min: 22 + seed,
        temp_max: 31 + seed,
        conditions: ["Clear", "Clouds", "Rain", "Clear", "Clouds"][i],
        icon: ["01d", "03d", "10d", "01d", "02d"][i],
        description: ["clear sky", "scattered clouds", "light rain", "clear sky", "few clouds"][i],
        pop: [0.05, 0.2, 0.7, 0.1, 0.3][i],
      }
    }),
  }
}
