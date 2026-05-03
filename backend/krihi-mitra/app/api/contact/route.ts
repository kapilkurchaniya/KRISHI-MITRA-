import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX = 5
const ipHits = new Map<string, { count: number; reset: number }>()

function rateLimit(ip: string) {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || entry.reset < now) {
    ipHits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    return true
  }
  entry.count += 1
  return entry.count <= RATE_MAX
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests, try again in a minute." }, { status: 429 })
  }

  const body = await request.json().catch(() => ({}))
  const name = String(body?.name ?? "").trim().slice(0, 120)
  const email = String(body?.email ?? "").trim().slice(0, 200)
  const phone = String(body?.phone ?? "").trim().slice(0, 40)
  const subject = String(body?.subject ?? "").trim().slice(0, 200)
  const message = String(body?.message ?? "").trim().slice(0, 4000)

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 })
  }
  // very small email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("contact_messages").insert({
      user_id: user?.id ?? null,
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
