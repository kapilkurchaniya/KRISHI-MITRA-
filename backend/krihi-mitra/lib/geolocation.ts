// Browser geolocation helper with graceful fallbacks

export type Coords = { lat: number; lon: number; accuracy?: number }
export type GeoLocation = {
  lat: number
  lon: number
  village?: string
  district?: string
  state?: string
  country?: string
  formatted?: string
}

export function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported on this device."))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => {
        const messages: Record<number, string> = {
          1: "Location permission denied. Please enable location access in your browser.",
          2: "Location unavailable. Check your device's GPS or network.",
          3: "Location request timed out. Please try again.",
        }
        reject(new Error(messages[err.code] || err.message))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    )
  })
}

export async function reverseGeocode(coords: Coords): Promise<GeoLocation> {
  // Calls our own /api/geocode which uses OpenWeather server-side
  const res = await fetch(`/api/geocode?lat=${coords.lat}&lon=${coords.lon}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    return { lat: coords.lat, lon: coords.lon }
  }
  const data = await res.json()
  return {
    lat: coords.lat,
    lon: coords.lon,
    village: data.village,
    district: data.district,
    state: data.state,
    country: data.country,
    formatted: data.formatted,
  }
}

export async function detectLocation(): Promise<GeoLocation> {
  const coords = await getCurrentPosition()
  return reverseGeocode(coords)
}

export async function detectCurrentLocation() {
  const location = await detectLocation()
  return {
    lat: location.lat,
    lon: location.lon,
    village: location.village ?? null,
    district: location.district ?? null,
    state: location.state ?? null,
    country: location.country ?? null,
  }
}

const LOC_KEY = "ai_krishi_last_location"

export function cacheLocation(loc: GeoLocation) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(LOC_KEY, JSON.stringify({ ...loc, ts: Date.now() }))
  } catch {}
}

export function getCachedLocation(): GeoLocation | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(LOC_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // 30 minute freshness
    if (Date.now() - parsed.ts > 30 * 60 * 1000) return null
    return parsed
  } catch {
    return null
  }
}
