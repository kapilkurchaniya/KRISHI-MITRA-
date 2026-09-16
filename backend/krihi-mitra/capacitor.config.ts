import type { CapacitorConfig } from "@capacitor/cli"

// AI Krishi Capacitor configuration.
// We ship a thin native wrapper that loads the production PWA over HTTPS,
// so updates roll out immediately without forcing users to update the APK.
//
// To build a real signed APK locally:
//   pnpm install
//   pnpm dlx @capacitor/cli init "AI Krishi" "app.aikrishi" --web-dir=public
//   pnpm dlx @capacitor/cli add android
//   pnpm dlx @capacitor/cli sync android
//   cd android && ./gradlew assembleRelease
//
// The CI workflow at .github/workflows/android-apk.yml automates this on every tag.

const config: CapacitorConfig = {
  appId: "app.aikrishi",
  appName: "AI Krishi",
  webDir: "public",
  server: {
    // Replace with your deployed URL or set NEXT_PUBLIC_APP_URL in the build environment.
    url: process.env.NEXT_PUBLIC_APP_URL || "https://ai-krishi.vercel.app",
    androidScheme: "https",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#16a34a",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
}

export default config
