import Link from "next/link"
import { redirect } from "next/navigation"
import { ScanLine, AlertTriangle, CheckCircle2, MessageCircle, ArrowLeft } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { StatusBanner } from "@/components/ui/status-banner"
import { createClient } from "@/lib/supabase/server"
import type { Scan } from "@/lib/types"

export default async function ScanResultPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) redirect("/scanner")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user!.id)
    .eq("id", id)
    .maybeSingle<Scan>()

  if (!scan) {
    return (
      <>
        <TopBar title="Result" showBack />
        <div className="px-4 pt-4">
          <StatusBanner variant="error" title="Not found">
            We couldn&apos;t find that scan.
          </StatusBanner>
          <Link
            href="/scanner"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to scanner
          </Link>
        </div>
      </>
    )
  }

  const healthy = scan.severity === "healthy"
  const confidence = Math.round((scan.confidence ?? 0) * 100)

  return (
    <>
      <TopBar title="Scan result" showBack />
      <div className="px-4 pt-4 flex flex-col gap-4">
        {scan.image_url ? (
          <img
            src={scan.image_url || "/placeholder.svg"}
            alt={scan.disease || scan.crop || "Plant scan"}
            className="w-full rounded-2xl object-cover aspect-square border border-border"
          />
        ) : null}

        <div
          className={`rounded-2xl p-5 text-card-foreground ${
            healthy ? "bg-primary/10" : "bg-destructive/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-1">
            <span
              className={`size-10 rounded-xl flex items-center justify-center ${
                healthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
              }`}
            >
              {healthy ? (
                <CheckCircle2 className="size-5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="size-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">
                {scan.crop || "Plant"} - {scan.severity || "diagnosis"}
              </div>
              <h2 className="font-serif text-xl font-bold">{scan.disease || "Healthy"}</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{scan.summary || "No detailed summary available."}</p>
          <div className="mt-3 text-xs opacity-80">Confidence: {confidence}%</div>
        </div>

        {scan.recommendations && scan.recommendations.length > 0 ? (
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ScanLine className="size-4 text-primary" aria-hidden="true" />
              Recommended actions
            </h3>
            <ol className="space-y-2 text-sm leading-relaxed list-decimal list-inside text-foreground">
              {scan.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <Link
          href={`/mitra?topic=${encodeURIComponent(scan.disease || scan.crop || "plant")}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-3 font-semibold"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Ask Krishi Mitra about this
        </Link>
      </div>
    </>
  )
}
