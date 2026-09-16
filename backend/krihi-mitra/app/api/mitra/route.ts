import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createClient } from "@/lib/supabase/server"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Personalize the assistant with the farmer's profile
    let profileContext = ""
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, preferred_language, state, district, village, primary_crops, farm_size_acres")
          .eq("id", user.id)
          .maybeSingle()
        if (profile) {
          const crops = Array.isArray(profile.primary_crops) ? profile.primary_crops.join(", ") : profile.primary_crops ?? "-"
          profileContext = `\n\nUser context (use to personalize answers):\nName: ${profile.full_name ?? "-"}\nLocation: ${[profile.village, profile.district, profile.state].filter(Boolean).join(", ") || "-"}\nLanguage: ${profile.preferred_language ?? "en"}\nPrimary crops: ${crops}\nFarm size: ${profile.farm_size_acres ?? "-"} acres`
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching user profile:", error)
    }

    // Convert UIMessage format to ModelMessage format
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are Krishi Mitra, a professional AI farming assistant specialized in Indian agriculture.

EXPERTISE:
- Crop diseases and pest management with visual analysis
- Soil health and preparation techniques
- Weather impact on crops and irrigation strategies
- Government schemes (PM-KISAN, PMFBY, RRBY) and subsidies
- Market prices and crop trading strategies
- Sustainable and organic farming methods
- Livestock and dairy farming
- Climate-smart agriculture practices

RESPONSE GUIDELINES:
- Reply in the user's preferred language with agricultural precision
- Provide detailed, actionable steps farmers can implement immediately
- Include quantities, costs in Indian Rupees (Rs), and expected yields
- Reference government schemes and local Krishi Vigyan Kendras
- For diseases: describe symptoms, causes, prevention, and organic/chemical treatments
- For pests: provide life cycle, damage patterns, and IPM strategies
- Always recommend reading pesticide labels and using proper PPE
- Give time-based advice (when to sow, irrigate, fertilize, harvest)
- Do NOT provide medical or veterinary advice - redirect to qualified experts

TONE:
- Friendly, respectful, and encouraging
- Acknowledge traditional farming wisdom
- Practical solutions for small/marginal farmers
- No generic advice - always personalize based on location and crops${profileContext}`,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Mitra API Error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return new Response(
      JSON.stringify({ 
        error: "Failed to process your question. Please try again.",
        code: "REQUEST_FAILED"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
