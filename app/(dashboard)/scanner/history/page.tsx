import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"
import { ScanHistoryList } from "../_components/scan-history-list"

export default async function ScannerHistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: scans } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <TopBar title="Scan history" showBack />
      <div className="px-4 pt-4">
        <ScanHistoryList scans={scans ?? []} />
      </div>
    </>
  )
}
