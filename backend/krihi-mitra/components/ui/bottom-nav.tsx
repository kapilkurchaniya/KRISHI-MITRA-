"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ScanLine, CloudSun, IndianRupee, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/crop-scanner", label: "Scan", icon: ScanLine },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/mandi", label: "Mandi", icon: IndianRupee },
  { href: "/alerts", label: "Alerts", icon: Bell },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-bottom"
    >
      <ul className="mx-auto max-w-md grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.25]")} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
