import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { BottomNav } from "@/components/ui/bottom-nav"
import { MitraFab } from "@/components/ui/mitra-fab"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user
  
  if (!user) {
    // If somehow middleware didn't catch it
    // For now we just return null to avoid rendering.
    return null
  }

  let shouldRedirect = false;

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { onboarded: true },
    })

    if (!profile || profile.onboarded === false) {
      shouldRedirect = true;
    }
  } catch (error) {
    console.error('[v0] Dashboard layout error:', error)
    // If DB lookup fails, let them in
  }

  if (shouldRedirect) {
    redirect("/profile-setup")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-dvh bg-background flex flex-col relative w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6 md:flex hidden justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="font-semibold text-lg">AI Krishi</div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
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
