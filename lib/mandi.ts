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

export async function getMandiPrices(crop: string, state?: string) {
  const today = new Date().toISOString().slice(0, 10)
  
  const where: any = { crop }
  if (state) {
    where.state = state
  }

  const { prisma } = await import("./db")
  
  const prices = await prisma.mandiPrice.findMany({
    where,
    orderBy: { modal_price: 'desc' }
  })
  
  // If the DB is empty (e.g. sync hasn't run), we'll fallback to a base placeholder
  // but ideally we should just return the real prices. 
  if (prices.length === 0) {
    return []
  }
  
  return prices.map(p => ({
    ...p,
    trend: p.trend as "up" | "down" | "stable"
  }))
}

export function getCropMeta(id: string) {
  return CROP_CATALOG.find((c) => c.id === id) ?? null
}
