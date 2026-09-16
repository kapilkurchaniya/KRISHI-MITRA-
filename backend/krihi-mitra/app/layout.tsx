import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Manrope } from "next/font/google"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { PwaRegister } from "@/components/pwa/pwa-register"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import { LenisProvider } from "@/components/providers/lenis-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const APP_NAME = "AI Krishi"
const APP_DESCRIPTION =
  "AI Krishi - Smart farming assistant for Indian farmers. Plant disease scanner, hyperlocal weather, mandi prices, irrigation alerts and Krishi Mitra AI."

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Smart Farming Assistant`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "AI Krishi",
    "smart farming",
    "plant disease scanner",
    "mandi prices",
    "weather forecast",
    "Indian farmers",
    "Krishi Mitra",
    "agriculture app",
  ],
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
  openGraph: {
    type: "website",
    title: `${APP_NAME} - Smart Farming Assistant`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-dvh bg-background text-foreground">
        <LenisProvider />
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <PwaRegister />
            <Toaster />
            {process.env.NODE_ENV === "production" && <Analytics />}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
