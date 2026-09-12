"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, Loader2, RotateCcw, Send } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { StatusBanner } from "@/components/ui/status-banner"

export default function ScannerCapturePage() {
  const router = useRouter()
  const params = useSearchParams()
  const isUpload = params.get("source") === "upload"
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [crop, setCrop] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function reset() {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function submit() {
    if (!file) {
      setError("Please add a photo first.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const reader = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch("/api/scanner/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, crop }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Analysis failed")
      }
      const data = await res.json()
      router.push(`/scanner/result?id=${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze image")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <TopBar title={isUpload ? "Upload photo" : "Scan plant"} showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        {error ? <StatusBanner variant="error">{error}</StatusBanner> : null}

        <div className="rounded-2xl border border-border bg-card aspect-square overflow-hidden flex items-center justify-center">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Selected plant" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6">
              <div className="mx-auto size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Camera className="size-6" aria-hidden="true" />
              </div>
              <p className="font-medium">No photo selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isUpload ? "Pick a clear photo from your gallery" : "Use your camera to capture a leaf"}
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          {...(!isUpload ? { capture: "environment" as const } : {})}
          className="hidden"
          onChange={onPick}
        />

        <div className="flex gap-2">
          {preview ? (
            <button
              type="button"
              onClick={reset}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-card border border-border py-3 font-medium hover:bg-muted"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Retake
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-card border border-border py-3 font-medium hover:bg-muted"
          >
            <Camera className="size-4" aria-hidden="true" />
            {preview ? "Change" : isUpload ? "Choose photo" : "Open camera"}
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="crop">
            Crop (optional)
          </label>
          <input
            id="crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full bg-transparent outline-none py-1 text-foreground"
            placeholder="e.g., Tomato, Wheat, Cotton"
          />
        </div>

        <button
          type="button"
          disabled={!preview || submitting}
          onClick={submit}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {submitting ? "Analyzing..." : "Analyze plant"}
        </button>
      </div>
    </>
  )
}
