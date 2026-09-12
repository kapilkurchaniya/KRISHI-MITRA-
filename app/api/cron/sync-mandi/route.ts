import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { CROP_CATALOG } from "@/lib/mandi"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
const STATES = ["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat"]

const MandiPriceSchema = z.object({
  market: z.string(),
  state: z.string(),
  min_price: z.number(),
  max_price: z.number(),
  modal_price: z.number(),
  trend: z.enum(["up", "down", "stable"]).default("stable"),
  change_pct: z.number().default(0),
})

export const maxDuration = 60 // Allow longer execution for syncing

export async function GET(req: Request) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    
    // We will sync a random subset of crops and states to avoid hitting rate limits too quickly
    // For a real production app, this would be a proper background queue
    const targetCrops = CROP_CATALOG.slice(0, 3) 
    
    for (const crop of targetCrops) {
      for (const state of STATES.slice(0, 2)) { // Just 2 states per crop for demo
        const query = `Latest mandi rates for ${crop.name} in ${state} today`
        
        // 1. Fetch from Tavily
        const searchRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query,
            search_depth: "basic",
            include_answer: true,
          }),
        })
        
        if (!searchRes.ok) {
          console.error(`Tavily error for ${crop.name} in ${state}: ${searchRes.statusText}`)
          continue
        }
        
        const searchData = await searchRes.json()
        const context = searchData.results.map((r: any) => r.content).join("\n") + "\n" + (searchData.answer || "")
        
        // 2. Parse with Groq
        const { object } = await generateObject({
          model: groq("llama-3.3-70b-versatile"),
          schema: z.object({
            prices: z.array(MandiPriceSchema)
          }),
          prompt: `Extract the latest mandi (market) prices for ${crop.name} in the state of ${state} from the following text. 
If no data is found, return an empty array.
Text: ${context}`,
        })
        
        // 3. Save to database
        for (const price of object.prices) {
          await prisma.mandiPrice.upsert({
            where: {
              crop_market_arrival_date: {
                crop: crop.id,
                market: price.market,
                arrival_date: today,
              }
            },
            update: {
              min_price: price.min_price,
              max_price: price.max_price,
              modal_price: price.modal_price,
              trend: price.trend,
              change_pct: price.change_pct,
            },
            create: {
              crop: crop.id,
              market: price.market,
              state: price.state,
              min_price: price.min_price,
              max_price: price.max_price,
              modal_price: price.modal_price,
              trend: price.trend,
              change_pct: price.change_pct,
              arrival_date: today,
            }
          })
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true, message: "Sync completed" }), {
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error("Mandi sync error:", error)
    return new Response(JSON.stringify({ error: "Sync failed" }), { status: 500 })
  }
}
