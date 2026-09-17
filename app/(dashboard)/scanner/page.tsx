import Link from "next/link"
import { Camera, Upload, History, ArrowRight, ScanLine, Leaf } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"
import { ScanHistoryList } from "./_components/scan-history-list"

export default async function ScannerPage() {
  let scans = []

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: scansData } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
      scans = scansData ?? []
    }
  } catch (error) {
    console.error('[v0] Scanner page error:', error)
  }

  return (
    <>
      <TopBar title="Plant Scanner" showBack />
      <div className="flex flex-col gap-5 lg:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
          <div className="flex flex-col gap-5 lg:gap-8">
            <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 lg:p-8">
              <div className="flex items-center gap-3 lg:gap-5">
                <div className="size-12 lg:size-16 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
                  <ScanLine className="size-6 lg:size-8" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-lg lg:text-2xl font-bold">Detect crop diseases instantly</h2>
                  <p className="text-xs lg:text-sm opacity-90">98% accuracy across 40+ common Indian crops</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 lg:gap-5">
              <Link
                href="/scanner/capture"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card aspect-square hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <span className="size-12 lg:size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Camera className="size-6 lg:size-7" aria-hidden="true" />
                </span>
                <span className="font-medium lg:text-lg">Take photo</span>
                <span className="text-[11px] lg:text-xs text-muted-foreground">Use your camera</span>
              </Link>
              <Link
                href="/scanner/capture?source=upload"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card aspect-square hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <span className="size-12 lg:size-14 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Upload className="size-6 lg:size-7" aria-hidden="true" />
                </span>
                <span className="font-medium lg:text-lg">Upload photo</span>
                <span className="text-[11px] lg:text-xs text-muted-foreground">From gallery</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:gap-8">
            <section className="rounded-2xl border border-border bg-card p-4 lg:p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-2 lg:mb-4 lg:text-lg">
                <Leaf className="size-4 lg:size-5 text-primary" aria-hidden="true" />
                Tips for the best scan
              </h3>
              <ul className="text-sm lg:text-base text-muted-foreground space-y-1.5 lg:space-y-2.5 leading-relaxed list-disc list-inside">
                <li>Take a close-up of one affected leaf in natural light.</li>
                <li>Keep the leaf in focus and fill 70% of the frame.</li>
                <li>Avoid shadows and reflections.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2 lg:gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg lg:text-xl font-bold flex items-center gap-2">
                  <History className="size-5 lg:size-6" aria-hidden="true" />
                  Recent scans
                </h2>
                {scans && scans.length > 0 ? (
                  <Link
                    href="/scanner/history"
                    className="text-xs lg:text-sm text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    View all <ArrowRight className="size-3.5 lg:size-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
              <ScanHistoryList scans={scans} />
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
