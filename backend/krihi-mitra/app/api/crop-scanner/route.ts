import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createClient } from "@/lib/supabase/server"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export const maxDuration = 60

interface ScanRequest {
  imageBase64: string
  mimeType: "image/jpeg" | "image/png" | "image/webp"
}

export async function POST(req: Request) {
  try {
    const body: ScanRequest = await req.json()

    if (!body.imageBase64 || !body.mimeType) {
      return Response.json(
        { error: "Image data and mimeType are required" },
        { status: 400 }
      )
    }

    // Groq base64 hard limit is 4MB — reject early with a clear message
    const base64Bytes = Math.ceil(body.imageBase64.length * 0.75)
    if (base64Bytes > 3.8 * 1024 * 1024) {
      return Response.json(
        { error: "Image is too large for analysis. Please use a smaller image (under 4MB)." },
        { status: 413 }
      )
    }

    const dataUri = `data:${body.mimeType};base64,${body.imageBase64}`

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: dataUri,
            },
            {
              type: "text",
              text: `You are an expert agricultural scientist and plant pathologist specializing in Indian crops.

STEP 1 — Is this a crop plant?
Look carefully at the image. If it does NOT show a recognizable crop plant or its leaves/fruit/stem (e.g. it is a person, animal, vehicle, building, soil only, or unclear), respond ONLY with this exact JSON:
{"is_crop":false,"error":"This image does not appear to contain a crop plant. Please upload a clear photo of a crop, plant leaf, or affected area.","confidence":90}

STEP 2 — If it IS a crop plant, analyze it thoroughly and respond with this exact JSON:
{
  "is_crop": true,
  "crop_type": "Crop common name (e.g. Wheat, Rice, Tomato, Cotton, Potato, Maize)",
  "health_status": "Healthy | Diseased | Pest Affected | Nutrient Deficient | Stressed",
  "disease_name": "Name of disease or pest, or 'None' if healthy",
  "severity": "Healthy | Minor (1-20%) | Moderate (20-50%) | Severe (50-80%) | Critical (80%+)",
  "symptoms": "Describe visible symptoms in 1-2 sentences",
  "cause": "Root cause (fungal, bacterial, viral, pest, deficiency, etc.)",
  "organic_treatment": "3-5 practical organic/natural treatment steps",
  "chemical_treatment": "2-3 specific chemical treatments with product names and dosage",
  "prevention": "3-4 prevention tips for the future",
  "urgency": "Immediate action needed | Within 3 days | Within 1 week | Monitor weekly | No action needed",
  "estimated_yield_loss": "Estimated yield loss if untreated (e.g. 20-30%)",
  "confidence": 85
}

Rules:
- confidence is a plain number (0-100), not a string
- Respond with ONLY the JSON object, no markdown, no explanation, no code fences`,
            },
          ],
        },
      ],
    })

    // Strip any accidental markdown fences
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim()

    let analysisData
    try {
      analysisData = JSON.parse(cleaned)
    } catch {
      console.error("[v0] Crop scanner JSON parse failed. Raw:", text)
      return Response.json(
        { error: "Analysis failed to parse. Please try again with a clearer image." },
        { status: 500 }
      )
    }

    // Best-effort DB logging
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && analysisData.is_crop) {
        await supabase.from("crop_scans").insert({
          user_id: user.id,
          crop_type: analysisData.crop_type,
          health_status: analysisData.health_status,
          disease_name: analysisData.disease_name,
          severity: analysisData.severity,
          analysis_data: analysisData,
          image_url: null,
        })
      }
    } catch {
      // Non-fatal — scan result still returned
    }

    return Response.json(analysisData)
  } catch (error) {
    console.error("[v0] Crop Scanner Error:", error)
    const msg = error instanceof Error ? error.message : "Unknown error"
    // Surface the real Groq error to help debugging
    return Response.json(
      { error: `Analysis failed: ${msg}` },
      { status: 500 }
    )
  }
}
