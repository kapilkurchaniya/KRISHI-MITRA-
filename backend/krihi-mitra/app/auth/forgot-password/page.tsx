"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2 } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { StatusBanner } from "@/components/ui/status-banner"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-muted-foreground">We&apos;ll email you a secure link to set a new password.</p>
      </div>

      {error ? <StatusBanner variant="error">{error}</StatusBanner> : null}
      {sent ? (
        <StatusBanner variant="success" title="Email sent">
          Check your inbox for the reset link.
        </StatusBanner>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<Mail className="size-4" />}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link href="/auth/login" className="text-center text-sm text-primary hover:underline">
        Back to sign in
      </Link>
    </section>
  )
}
