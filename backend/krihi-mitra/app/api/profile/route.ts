import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const body = (await request.json()) as Record<string, unknown>
    const allowed = [
      "full_name",
      "phone",
      "preferred_language",
      "state",
      "district",
      "village",
      "farm_size_acres",
      "primary_crops",
    ] as const
    const update: Record<string, unknown> = {}
    for (const k of allowed) if (k in body) update[k] = body[k]
    update.onboarded = true

    const { data, error } = await supabase.from("profiles").update(update).eq("id", user.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
