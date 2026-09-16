"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Loader2, Sprout } from "lucide-react"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { StatusBanner } from "@/components/ui/status-banner"
import { createClient } from "@/lib/supabase/client"
import { detectCurrentLocation } from "@/lib/geolocation"
import { LANGUAGES, INDIAN_STATES } from "@/lib/constants"
import { t as translate } from "@/lib/translations"
import { useLanguage } from "@/components/providers/language-provider"

export default function ProfileSetupPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = (key: string) => translate(key, language as "en" | "hi")
  
  const [lang, setLang] = useState("en")
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")
  const [farmSize, setFarmSize] = useState("")
  const [primaryCrop, setPrimaryCrop] = useState("")
  const [loadingLoc, setLoadingLoc] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    // Try to auto-detect on mount
    handleDetect(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleDetect(silent = false) {
    setLoadingLoc(true)
    setError(null)
    try {
      const loc = await detectCurrentLocation()
      if (loc.state) setState(loc.state)
      if (loc.district) setDistrict(loc.district)
      if (loc.village) setVillage(loc.village)
      setInfo(`Detected: ${[loc.village, loc.district, loc.state].filter(Boolean).join(", ")}`)
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Could not detect location")
      }
    } finally {
      setLoadingLoc(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not signed in")

      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_language: lang,
          state,
          district,
          village,
          farm_size_acres: farmSize ? Number(farmSize) : null,
          primary_crops: primaryCrop ? [primaryCrop] : [],
          onboarded: true,
        })
        .eq("id", user.id)
      if (error) throw error
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto max-w-md px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="mx-auto mb-3 size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Sprout className="size-7" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-bold">{t("profile.tellAboutFarm")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("profile.personalizeForYou")}
          </p>
        </div>

        {error ? <StatusBanner variant="error">{error}</StatusBanner> : null}
        {info ? <StatusBanner variant="success">{info}</StatusBanner> : null}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormSelect
            label={t("profile.preferredLanguage")}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            options={LANGUAGES}
          />

          <button
            type="button"
            onClick={() => handleDetect(false)}
            disabled={loadingLoc}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary py-3 text-sm font-medium hover:bg-primary/10 disabled:opacity-60"
          >
            {loadingLoc ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <MapPin className="size-4" aria-hidden="true" />
            )}
            {loadingLoc ? t("profile.detectingLocation") : t("profile.autoDetectLocation")}
          </button>

          <FormSelect
            label={t("profile.state")}
            value={state}
            onChange={(e) => setState(e.target.value)}
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            placeholder={t("profile.selectState")}
            required
          />
          <FormInput
            label={t("profile.district")}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder={t("profile.enterDistrict")}
            required
          />
          <FormInput
            label={t("profile.village")}
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder={t("profile.enterVillage")}
            required
          />
          <FormInput
            label={t("profile.farmSize")}
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            placeholder="0.0"
            hint={t("profile.optional")}
          />
          <FormInput
            label={t("profile.primaryCrop")}
            value={primaryCrop}
            onChange={(e) => setPrimaryCrop(e.target.value)}
            placeholder={t("profile.cropPlaceholder")}
            hint={t("profile.optional")}
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {saving ? t("profile.saving") : t("profile.continueToDashboard")}
          </button>
        </form>
      </div>
    </main>
  )
}
