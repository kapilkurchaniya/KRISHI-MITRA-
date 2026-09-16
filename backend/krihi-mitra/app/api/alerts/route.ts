import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DUMMY_ALERTS = [
  {
    id: "demo-1",
    title: "Heavy rain expected tomorrow",
    message: "Rainfall of 25-40mm forecasted in your district. Postpone irrigation and protect harvested crops.",
    severity: "high",
    kind: "weather",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "demo-2",
    title: "Pest alert: Brown plant hopper",
    message: "BPH infestations reported in nearby paddy fields. Inspect crops and consider IPM measures.",
    severity: "medium",
    kind: "pest",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "demo-3",
    title: "PM-KISAN installment released",
    message: "Rs 2,000 has been credited to eligible farmer accounts under PM-KISAN scheme. Check your bank statement.",
    severity: "low",
    kind: "scheme",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-4",
    title: "Mandi prices: Wheat up 5%",
    message: "Wheat modal price rose to Rs 2,250/quintal in nearby mandis. Good time to sell stored grain.",
    severity: "low",
    kind: "market",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const url = new URL(request.url)
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100)

    if (!user) {
      return NextResponse.json({ alerts: DUMMY_ALERTS.slice(0, limit) })
    }

    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Alerts query error:", error)
      return NextResponse.json({ alerts: DUMMY_ALERTS.slice(0, limit) })
    }

    // Return dummy data if user has no alerts yet
    const alerts = data && data.length > 0 ? data : DUMMY_ALERTS.slice(0, limit)
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("[v0] Alerts route error:", error)
    return NextResponse.json({ alerts: DUMMY_ALERTS })
  }
}
