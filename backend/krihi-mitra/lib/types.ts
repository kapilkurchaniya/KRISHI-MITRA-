// Core data models for AI Krishi

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  preferred_language: string
  state: string | null
  district: string | null
  village: string | null
  primary_crops: string[] | null
  farm_size_acres: number | null
  latitude: number | null
  longitude: number | null
  avatar_url: string | null
  pincode: string | null
  onboarded: boolean
  created_at: string
  updated_at: string
}

export type Scan = {
  id: string
  user_id: string
  crop: string | null
  disease: string | null
  confidence: number | null
  severity: "low" | "medium" | "high" | null
  image_url: string | null
  notes: string | null
  recommendations: string[] | null
  status: "processing" | "completed" | "failed"
  created_at: string
}

export type Alert = {
  id: string
  user_id: string
  type: "weather" | "pest" | "irrigation" | "market" | "general"
  title: string
  message: string
  severity: "info" | "warning" | "critical"
  is_read: boolean
  metadata: Record<string, unknown> | null
  created_at: string
}

export type ContactMessage = {
  id: string
  user_id: string | null
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: "new" | "in_progress" | "resolved"
  created_at: string
}

export type WeatherLog = {
  id: string
  user_id: string
  latitude: number
  longitude: number
  location_name: string | null
  temperature: number | null
  humidity: number | null
  wind_speed: number | null
  conditions: string | null
  raw: Record<string, unknown> | null
  created_at: string
}

export type MandiFavorite = {
  id: string
  user_id: string
  commodity: string
  market: string | null
  state: string | null
  district: string | null
  created_at: string
}

export type WeatherForecast = {
  location: { name: string; lat: number; lon: number; country?: string }
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    conditions: string
    icon: string
    description: string
  }
  daily: Array<{
    date: string
    temp_min: number
    temp_max: number
    conditions: string
    icon: string
    description: string
    pop: number // probability of precipitation
  }>
}

export type MandiPrice = {
  id: string
  crop: string
  variety?: string
  market: string
  state: string
  district?: string
  min_price: number
  max_price: number
  modal_price: number
  unit: string // e.g. "Quintal"
  arrival_date: string
  trend: "up" | "down" | "stable"
  change_pct: number
}

export type LocationInfo = {
  lat: number
  lon: number
  village?: string | null
  district?: string | null
  state?: string | null
  country?: string | null
}
