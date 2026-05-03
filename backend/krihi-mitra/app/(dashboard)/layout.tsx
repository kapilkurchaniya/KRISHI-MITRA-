import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BottomNav } from "@/components/ui/bottom-nav"
import { MitraFab } from "@/components/ui/mitra-fab"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/auth/login")

    // Force onboarding if profile doesn't exist or is incomplete
    const { data: profile } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle()
    if (!profile || profile.onboarded === false) {
      redirect("/profile-setup")
    }
  } catch (error) {
    console.error('[v0] Dashboard layout error:', error)
    redirect("/auth/login")
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-md pb-24">{children}</div>
      <MitraFab />
      <BottomNav />
    </div>
  )
}
