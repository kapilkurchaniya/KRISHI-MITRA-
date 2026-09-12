import Link from "next/link"
import { ScanLine, ChevronRight } from "lucide-react"
import type { Scan } from "@/lib/types"

const severityTone: Record<string, string> = {
  healthy: "bg-primary/10 text-primary",
  mild: "bg-accent/15 text-accent",
  moderate: "bg-accent/20 text-accent",
  severe: "bg-destructive/10 text-destructive",
}

export function ScanHistoryList({ scans }: { scans: Scan[] }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <div className="mx-auto size-12 rounded-xl bg-muted flex items-center justify-center mb-2">
          <ScanLine className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          No scans yet. Tap <span className="font-medium text-foreground">Take photo</span> to start.
        </p>
      </div>
    )
  }

  return (
    <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
      {scans.map((s) => (
        <li key={s.id}>
          <Link
            href={`/scanner/result?id=${s.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
          >
            {s.image_url ? (
              <img
                src={s.image_url || "/placeholder.svg"}
                alt={`Scan of ${s.crop || "plant"}`}
                className="size-12 rounded-lg object-cover"
              />
            ) : (
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                <ScanLine className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{s.disease || s.crop || "Plant scan"}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(s.created_at).toLocaleDateString()} &middot;{" "}
                {Math.round((s.confidence ?? 0) * 100)}% confidence
              </div>
            </div>
            {s.severity ? (
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                  severityTone[s.severity] || "bg-muted text-foreground"
                }`}
              >
                {s.severity}
              </span>
            ) : null}
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
