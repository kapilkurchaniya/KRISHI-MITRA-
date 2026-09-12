import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

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
    
    // We upsert because the row might not exist yet for new Clerk users
    const update: Record<string, unknown> = { id: userId, onboarded: true }
    for (const k of allowed) if (k in body) update[k] = body[k]

    const { data, error } = await supabase.from("profiles").upsert(update).select().single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
