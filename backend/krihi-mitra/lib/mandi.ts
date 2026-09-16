import type { MandiPrice } from "./types"

// Curated catalog of Indian mandi crops the user can browse.
export const CROP_CATALOG = [
  { id: "wheat", name: "Wheat", hindi: "गेहूं", emoji: "🌾" },
  { id: "rice", name: "Rice", hindi: "चावल", emoji: "🍚" },
  { id: "maize", name: "Maize", hindi: "मक्का", emoji: "🌽" },
  { id: "cotton", name: "Cotton", hindi: "कपास", emoji: "🪢" },
  { id: "soybean", name: "Soybean", hindi: "सोयाबीन", emoji: "🫘" },
  { id: "sugarcane", name: "Sugarcane", hindi: "गन्ना", emoji: "🎋" },
  { id: "onion", name: "Onion", hindi: "प्याज", emoji: "🧅" },
  { id: "potato", name: "Potato", hindi: "आलू", emoji: "🥔" },
  { id: "tomato", name: "Tomato", hindi: "टमाटर", emoji: "🍅" },
  { id: "mustard", name: "Mustard", hindi: "सरसों", emoji: "🌼" },
  { id: "groundnut", name: "Groundnut", hindi: "मूंगफली", emoji: "🥜" },
  { id: "chickpea", name: "Chickpea (Chana)", hindi: "चना", emoji: "🟡" },
] as const

export type CropId = (typeof CROP_CATALOG)[number]["id"]

const STATES = ["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat"]
const MARKETS: Record<string, string[]> = {
  Maharashtra: ["Pune", "Nashik", "Nagpur", "Solapur"],
  Punjab: ["Ludhiana", "Amritsar", "Patiala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain"],
  Karnataka: ["Bengaluru", "Hubli", "Mysuru"],
  Gujarat: ["Ahmedabad", "Rajkot", "Surat"],
}

const BASE_PRICES: Record<string, number> = {
  wheat: 2350,
  rice: 3200,
  maize: 2050,
  cotton: 7100,
  soybean: 4600,
  sugarcane: 350,
  onion: 1800,
  potato: 1450,
  tomato: 2200,
  mustard: 5400,
  groundnut: 6200,
  chickpea: 5100,
}

// Deterministic pseudo-random — stable per crop+market+date so prices don't jitter.
function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h)
}

export function getMandiPrices(crop: string, state?: string): MandiPrice[] {
  const today = new Date().toISOString().slice(0, 10)
  const targetStates = state ? [state] : STATES
  const out: MandiPrice[] = []
  const base = BASE_PRICES[crop] ?? 2500

  for (const st of targetStates) {
    for (const market of MARKETS[st] ?? []) {
      const seed = hash(`${crop}-${market}-${today}`)
      const drift = (seed % 401) - 200 // -200..+200
      const modal = Math.max(100, Math.round(base + drift))
      const min = Math.round(modal * 0.92)
      const max = Math.round(modal * 1.08)
      const changePct = +(((seed % 11) - 5) * 0.6).toFixed(1)
      const trend: "up" | "down" | "stable" = changePct > 1 ? "up" : changePct < -1 ? "down" : "stable"
      out.push({
        id: `${crop}-${market}`,
        crop,
        market,
        state: st,
        min_price: min,
        max_price: max,
        modal_price: modal,
        unit: crop === "sugarcane" ? "Quintal" : "Quintal",
        arrival_date: today,
        trend,
        change_pct: changePct,
      })
    }
  }
  return out.sort((a, b) => b.modal_price - a.modal_price)
}

export function getCropMeta(id: string) {
  return CROP_CATALOG.find((c) => c.id === id) ?? null
}
