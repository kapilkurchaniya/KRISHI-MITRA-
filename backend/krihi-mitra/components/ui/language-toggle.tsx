"use client"

import { useLanguage } from "../providers/language-provider"
import { Button } from "./button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-xs rounded-full"
      >
        English
      </Button>
      <Button
        variant={language === "hi" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("hi")}
        className="text-xs rounded-full"
      >
        हिन्दी
      </Button>
    </div>
  )
}
