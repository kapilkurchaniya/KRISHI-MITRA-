import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, password, fullName, phone } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 })
    }

    // Use service role key to create pre-confirmed user
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create user with email already confirmed (skip email verification)
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || "",
        phone: phone || "",
      },
    })

    if (error) {
      // If user already exists, that's okay - they can just sign in
      if (error.message.includes("already") || error.message.includes("registered")) {
        return NextResponse.json({ success: true, message: "User exists" }, { status: 200 })
      }
      console.error("[v0] Admin signup error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create profile record
    if (data.user) {
      const { error: profileError } = await adminClient.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName || "",
        phone: phone || "",
        onboarded: false,
      })
      if (profileError) {
        console.error("[v0] Profile creation error:", profileError)
      }
    }

    return NextResponse.json({ success: true, userId: data.user?.id })
  } catch (error) {
    console.error("[v0] Signup route error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    )
  }
}
