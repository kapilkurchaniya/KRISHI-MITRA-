"use client"

import { useState } from "react"
import { Loader2, Save, MapPin } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { StatusBanner } from "@/components/ui/status-banner"
import { LANGUAGES, INDIAN_STATES } from "@/lib/constants"
import { detectCurrentLocation } from "@/lib/geolocation"

type Profile = {
  full_name: string | null
  phone: string | null
  preferred_language: string
  state: string | null
  district: string | null
  village: string | null
  farm_size_acres: number | null
  primary_crops: string[] | null
} | null

export function ProfileForm({ initial, email }: { initial: Profile; email: string }) {
  const [fullName, setFullName] = useState(initial?.full_name ?? "")
  const [phone, setPhone] = useState(initial?.phone ?? "")
  const [language, setLanguage] = useState(initial?.preferred_language ?? "en")
  const [state, setState] = useState(initial?.state ?? "")
  const [district, setDistrict] = useState(initial?.district ?? "")
  const [village, setVillage] = useState(initial?.village ?? "")
  const [farmSize, setFarmSize] = useState(initial?.farm_size_acres?.toString() ?? "")
  const [primaryCrop, setPrimaryCrop] = useState(Array.isArray(initial?.primary_crops) ? initial.primary_crops[0] ?? "" : "")
  const [saving, setSaving] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function detect() {
    setDetecting(true)
    setMsg(null)
    try {
      const loc = await detectCurrentLocation()
      if (loc.state) setState(loc.state)
      if (loc.district) setDistrict(loc.district)
      if (loc.village) setVillage(loc.village)
      setMsg({ type: "success", text: "Location updated from GPS." })
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Could not detect location" })
    } finally {
      setDetecting(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          preferred_language: language,
          state,
          district,
          village,
          farm_size_acres: farmSize ? Number(farmSize) : null,
          primary_crops: primaryCrop ? [primaryCrop] : [],
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Save failed")
      }
      setMsg({ type: "success", text: "Profile saved." })
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Could not save" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {msg ? (
        <StatusBanner variant={msg.type === "success" ? "success" : "error"}>{msg.text}</StatusBanner>
      ) : null}

      <FormInput label="Email" value={email} disabled hint="Email cannot be changed here" />
      <FormInput label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <FormInput label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <FormSelect
        label="Preferred Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        options={LANGUAGES}
      />

      <button
        type="button"
        onClick={detect}
        disabled={detecting}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary py-3 text-sm font-medium hover:bg-primary/10 disabled:opacity-60"
      >
        {detecting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <MapPin className="size-4" aria-hidden="true" />}
        {detecting ? "Detecting Location..." : "Auto-Detect My Location"}
      </button>

      <FormSelect
        label="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
        placeholder="Select Your State"
      />
      <FormInput label="District" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter District" />
      <FormInput label="Village" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Enter Village" />
      <FormInput
        label="Farm Size (Acres)"
        type="number"
        inputMode="decimal"
        value={farmSize}
        onChange={(e) => setFarmSize(e.target.value)}
        placeholder="0.0"
      />
      <FormInput 
        label="Primary Crop" 
        value={primaryCrop} 
        onChange={(e) => setPrimaryCrop(e.target.value)}
        placeholder="e.g., Rice, Wheat, Cotton"
      />

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
      >
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  )
}
