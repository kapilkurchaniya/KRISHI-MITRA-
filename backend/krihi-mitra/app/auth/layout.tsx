import Link from "next/link"
import { LeafLogo } from "@/components/ui/leaf-logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-background flex flex-col">
      <header className="px-4 pt-6 pb-4">
        <Link href="/" aria-label="AI Krishi home" className="inline-flex">
          <LeafLogo size={32} withText />
        </Link>
      </header>
      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  )
}
