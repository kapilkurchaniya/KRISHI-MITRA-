"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { StatusBanner } from "@/components/ui/status-banner"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    try {
      // Create user via admin API (auto-confirms email)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Could not create account")
      }

      // Now sign in with the new account
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError

      // Redirect to profile setup
      router.push("/profile-setup")
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create account"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-muted-foreground">Join thousands of farmers using AI Krishi every day.</p>
      </div>

      {error ? <StatusBanner variant="error" title="Couldn&apos;t create account">{error}</StatusBanner> : null}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leadingIcon={<User className="size-4" />}
          autoComplete="name"
          placeholder="Ramesh Kumar"
        />
        <FormInput
          label="Phone number"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leadingIcon={<Phone className="size-4" />}
          autoComplete="tel"
          placeholder="+91 98765 43210"
        />
        <FormInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<Mail className="size-4" />}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock className="size-4" />}
          autoComplete="new-password"
          hint="At least 6 characters"
        />
        <FormInput
          label="Confirm password"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          leadingIcon={<Lock className="size-4" />}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60 mt-2"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  )
}
