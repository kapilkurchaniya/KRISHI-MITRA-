"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { StatusBanner } from "@/components/ui/status-banner"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Could not send message")

      setStatus({
        type: "success",
        text: "Thank you! We received your message and will reply within 24 hours.",
      })
      setName("")
      setEmail("")
      setPhone("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {status ? (
        <StatusBanner variant={status.type === "success" ? "success" : "error"}>{status.text}</StatusBanner>
      ) : null}
      <FormInput label="Your name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <FormInput
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <FormInput
        label="Phone (optional)"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
      />
      <FormInput
        label="Subject (optional)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Crop advice, partnership, bug report..."
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-xl border border-input bg-card py-3 px-3 outline-none text-foreground placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring resize-y"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  )
}
