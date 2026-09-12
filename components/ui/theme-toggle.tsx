"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "../providers/theme-provider"
import { Button } from "./button"

export function ThemeToggle() {
  const { setTheme, isDark } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
