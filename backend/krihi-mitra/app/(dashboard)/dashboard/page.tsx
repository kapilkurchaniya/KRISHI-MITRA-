import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "./_components/dashboard-content"
import { DashboardWeather } from "./_components/dashboard-weather"
import { DashboardMandi } from "./_components/dashboard-mandi"
import { DashboardAlerts } from "./_components/dashboard-alerts"

export default async function DashboardPage() {
  let profile = null
  let user = null

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, village, district, state, primary_crops")
        .eq("id", user.id)
        .maybeSingle()
      profile = profileData
    }
  } catch (error) {
    console.error('[v0] Dashboard error:', error)
  }

  return (
    <>
      <TopBar showLogo />
      <DashboardContent profile={profile}>
        <DashboardWeather />
        <DashboardMandi />
        <DashboardAlerts />
      </DashboardContent>
    </>
  )
}
