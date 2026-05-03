"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, AlertCircle, CheckCircle, Camera, X } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"

interface ScanResult {
  is_crop: boolean
  error?: string
  crop_type?: string
  health_status?: string
  disease_name?: string
  severity?: string
  symptoms?: string
  cause?: string
  organic_treatment?: string
  chemical_treatment?: string
  prevention?: string
  urgency?: string
  estimated_yield_loss?: string
  confidence?: number
}

// Compress + resize an image to stay under Groq's 4MB base64 limit
async function compressImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      // Cap at 1280px on the longest side — keeps quality while staying small
      const MAX = 1280
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width)
          width = MAX
        } else {
          width = Math.round((width * MAX) / height)
          height = MAX
        }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      // JPEG at 0.85 quality is a good balance of size vs clarity
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
      const base64 = dataUrl.split(",")[1]
      resolve({ base64, mimeType: "image/jpeg" })
    }
    img.onerror = reject
    img.src = url
  })
}

export default function CropScannerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>("image/jpeg")
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  async function handleImageSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setError(null)
    setResult(null)

    try {
      const { base64, mimeType: mime } = await compressImage(file)
      setImage(base64)
      setMimeType(mime)
      setFileName(file.name)
    } catch {
      setError("Could not load image. Please try another file.")
    }
  }

  async function analyze() {
    if (!image) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/crop-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image,
          mimeType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to analyze image")
        return
      }

      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze image"
      )
    } finally {
      setLoading(false)
    }
  }

  const isCrop = result?.is_crop

  return (
    <>
      <TopBar title="Crop Scanner" showBack />
      <div className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-background to-background/95 p-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          {!image && (
            <div className="space-y-4 mb-6">
              <div className="bg-accent/10 border border-accent/30 rounded-3xl p-8 text-center">
                <Camera className="size-12 mx-auto mb-4 text-accent" aria-hidden="true" />
                <h2 className="text-lg font-semibold mb-2">Scan Your Crop</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Upload a clear photo of your crop or plant. Our AI will analyze it for diseases,
                  pests, and health conditions with instant recommendations.
                </p>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
                  >
                    <Upload className="size-4" aria-hidden="true" />
                    Upload Photo
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-border hover:bg-muted font-medium transition-colors"
                  >
                    <Camera className="size-4" aria-hidden="true" />
                    Take Photo
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}

          {/* Image Preview */}
          {image && (
            <div className="space-y-4 mb-6">
              <div className="relative rounded-3xl overflow-hidden bg-muted">
                <img
                  src={`data:image/jpeg;base64,${image}`}
                  alt="Selected crop"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null)
                    setFileName("")
                    setResult(null)
                    setError(null)
                  }}
                  className="absolute top-3 right-3 size-9 inline-flex items-center justify-center rounded-full bg-background/90 hover:bg-background text-foreground hover:scale-110 transition-transform"
                  aria-label="Remove image"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="text-sm text-muted-foreground">{fileName}</div>

              {!result && (
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="size-4" aria-hidden="true" />
                      Analyze Crop
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive mb-6 flex gap-3">
              <AlertCircle className="size-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <div className="font-medium">Error</div>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {!isCrop ? (
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
                  <AlertCircle className="size-12 mx-auto mb-4 text-accent" aria-hidden="true" />
                  <h3 className="font-semibold text-lg mb-2">Not a Crop</h3>
                  <p className="text-muted-foreground">{result.error}</p>
                  <button
                    onClick={() => {
                      setImage(null)
                      setFileName("")
                      setResult(null)
                    }}
                    className="mt-4 px-4 py-2 rounded-full bg-accent/20 hover:bg-accent/30 text-accent font-medium transition-colors"
                  >
                    Try Another Image
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="rounded-2xl border border-border bg-card p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">
                        Crop Type
                      </div>
                      <h3 className="text-2xl font-bold mt-1">{result.crop_type}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                            result.health_status === "Healthy"
                              ? "bg-green-100 text-green-800"
                              : result.health_status === "Diseased"
                                ? "bg-red-100 text-red-800"
                                : result.health_status === "Pest Affected"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {result.health_status === "Healthy" && (
                            <CheckCircle className="size-3" aria-hidden="true" />
                          )}
                          {result.health_status}
                        </span>
                        {result.severity && result.severity !== "Healthy" && (
                          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-muted">
                            {result.severity}
                          </span>
                        )}
                        {result.confidence && (
                          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-muted">
                            {result.confidence}% confident
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Disease/Issues Info */}
                  {result.disease_name && (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <h4 className="font-semibold mb-2 text-destructive">
                        Issue Detected
                      </h4>
                      <p className="text-sm mb-3">{result.disease_name}</p>
                      {result.symptoms && (
                        <div className="text-xs space-y-2">
                          <div>
                            <span className="font-medium">Symptoms:</span>
                            <p className="text-muted-foreground mt-1">
                              {result.symptoms}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Urgency & Impact */}
                  {result.urgency || result.estimated_yield_loss ? (
                    <div className="grid grid-cols-2 gap-3">
                      {result.urgency && (
                        <div className="rounded-2xl border border-border bg-card p-4">
                          <div className="text-xs text-muted-foreground uppercase font-medium">
                            Action Needed
                          </div>
                          <p className="font-semibold mt-2">{result.urgency}</p>
                        </div>
                      )}
                      {result.estimated_yield_loss && (
                        <div className="rounded-2xl border border-border bg-card p-4">
                          <div className="text-xs text-muted-foreground uppercase font-medium">
                            Yield Loss Risk
                          </div>
                          <p className="font-semibold mt-2 text-destructive">
                            {result.estimated_yield_loss}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Treatments */}
                  {result.organic_treatment || result.chemical_treatment ? (
                    <div className="space-y-3">
                      {result.organic_treatment && (
                        <div className="rounded-2xl border border-border bg-card p-5">
                          <h4 className="font-semibold mb-3 text-green-700">
                            Organic Treatment
                          </h4>
                          <div className="text-sm space-y-2 text-muted-foreground whitespace-pre-wrap">
                            {result.organic_treatment}
                          </div>
                        </div>
                      )}
                      {result.chemical_treatment && (
                        <div className="rounded-2xl border border-border bg-card p-5">
                          <h4 className="font-semibold mb-3 text-amber-700">
                            Chemical Treatment
                          </h4>
                          <div className="text-sm space-y-2 text-muted-foreground whitespace-pre-wrap">
                            {result.chemical_treatment}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            Always read pesticide labels carefully. Use proper PPE (gloves,
                            masks, etc.). Follow local regulations.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Prevention */}
                  {result.prevention && (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <h4 className="font-semibold mb-3">Prevention</h4>
                      <div className="text-sm space-y-2 text-muted-foreground whitespace-pre-wrap">
                        {result.prevention}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <button
                    onClick={() => {
                      setImage(null)
                      setFileName("")
                      setResult(null)
                    }}
                    className="w-full px-4 py-3 rounded-full border border-border hover:bg-muted font-medium transition-colors"
                  >
                    Scan Another Crop
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
