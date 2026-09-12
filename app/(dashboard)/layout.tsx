import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { BottomNav } from "@/components/ui/bottom-nav"
import { MitraFab } from "@/components/ui/mitra-fab"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar" // We will create this
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user
  
  if (!user) {
    // If somehow middleware didn't catch it
    // For now we just return null to avoid rendering.
    return null
  }

  try {
    const supabase = await createClient()
    
    // Fetch profile from Supabase using Clerk user ID
    // Often Clerk IDs start with 'user_', so we check our profiles table
    const { data: profile } = await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle()
    
    // Force onboarding if profile doesn't exist or is incomplete
    if (!profile || profile.onboarded === false) {
      redirect("/profile-setup")
    }
  } catch (error) {
    console.error('[v0] Dashboard layout error:', error)
    // If Supabase fails, we might still let them in or redirect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-dvh bg-background flex flex-col relative w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6 md:flex hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="mr-4 font-semibold text-lg">AI Krishi</div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {/* The wrapper removes max-w-md constraint on desktop */}
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-6 pb-24 md:pb-6">
              {children}
            </div>
          </main>
          
          <MitraFab />
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
