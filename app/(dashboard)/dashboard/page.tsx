import { TopBar } from "@/components/ui/top-bar"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { DashboardContent } from "./_components/dashboard-content"
import { DashboardWeather } from "./_components/dashboard-weather"
import { DashboardMandi } from "./_components/dashboard-mandi"
import { DashboardAlerts } from "./_components/dashboard-alerts"

export default async function DashboardPage() {
  let profile = null

  try {
    const session = await auth()
    const userId = session?.user?.id

    if (userId) {
      profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          full_name: true,
          village: true,
          district: true,
          state: true,
          primary_crops: true,
        },
      })
    }
  } catch (error) {
    console.error('[v0] Dashboard error:', error)
  }

  return (
    <>
      <div className="md:hidden">
        <TopBar showLogo />
      </div>
      <div className="px-4 pt-4 pb-6">
        <DashboardContent profile={profile}>
          <DashboardWeather />
          <DashboardMandi />
          <DashboardAlerts />
        </DashboardContent>
      </div>
    </>
  )
}
