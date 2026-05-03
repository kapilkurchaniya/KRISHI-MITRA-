"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, Loader2 } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()

      // Try to sign in
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      // If user doesn't exist or email not confirmed, try to create them via admin API
      if (authError) {
        const isInvalidCreds = authError.message.toLowerCase().includes("invalid")
        const isUnconfirmed = authError.message.toLowerCase().includes("confirm")

        if (isInvalidCreds || isUnconfirmed) {
          // Try to create a confirmed user via server route
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          if (res.ok) {
            // Try signing in again now that user is confirmed
            const retry = await supabase.auth.signInWithPassword({ email, password })
            if (retry.error) {
              throw new Error("Could not sign in. Please check your credentials.")
            }
            authData = retry.data
          } else {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || "Could not sign in. Please check your credentials.")
          }
        } else {
          throw authError
        }
      }

      // Ensure profile exists
      if (authData?.user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, onboarded")
          .eq("id", authData.user.id)
          .maybeSingle()

        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: authData.user.id,
            email: authData.user.email,
            onboarded: false,
          })
          router.push("/profile-setup")
        } else if (!existingProfile.onboarded) {
          router.push("/profile-setup")
        } else {
          router.push(redirectTo)
        }
        router.refresh()
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not sign in"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue to your AI Krishi dashboard.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<Mail className="size-4" />}
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock className="size-4" />}
          placeholder="Your password"
        />
        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to AI Krishi?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  )
}
