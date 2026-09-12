import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const session = await auth();
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { data, error } = await supabase
      .from("mandi_favorites")
      .select("id, commodity, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ favorites: data ?? [] })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const session = await auth();
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const commodity = String(body?.commodity ?? "").trim()
    if (!commodity) return NextResponse.json({ error: "commodity is required" }, { status: 400 })

    const { data, error } = await supabase
      .from("mandi_favorites")
      .insert({ user_id: userId, commodity })
      .select("id, commodity, created_at")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ favorite: data })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const session = await auth();
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const { error } = await supabase.from("mandi_favorites").delete().eq("id", id).eq("user_id", userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
