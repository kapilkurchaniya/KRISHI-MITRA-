# Building the AI Krishi Android APK

The web app is the source of truth. The APK is a thin Capacitor wrapper that loads the production PWA, so users get instant updates without re-installing.

## One-time setup (local)

```bash
pnpm install
pnpm add -D @capacitor/cli
pnpm add @capacitor/core @capacitor/android
pnpm dlx @capacitor/cli add android
```

That creates an `android/` folder. Commit it.

## Building a signed release APK

1. Set your deployed URL:
   ```bash
   export NEXT_PUBLIC_APP_URL="https://your-deployment.vercel.app"
   ```
2. Sync the web URL into the native project:
   ```bash
   pnpm dlx @capacitor/cli sync android
   ```
3. From inside `android/`, build the release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
4. The signed APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

## Hosting the APK on the website

Once you have the signed APK, upload it to a publicly readable URL (Vercel Blob, S3, GitHub Releases) and set:

```bash
NEXT_PUBLIC_APK_URL="https://your-cdn/ai-krishi-vX.Y.Z.apk"
```

The `/download` page will automatically show a working "Download APK" button.

## Continuous build (GitHub Actions)

A workflow at `.github/workflows/android-apk.yml` builds an unsigned debug APK on every push to `main` and a signed release APK on every git tag (`v*`). Configure these repository secrets:

- `ANDROID_KEYSTORE_BASE64` &mdash; base64-encoded `.jks` keystore
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Tagged releases attach the signed APK to the GitHub Release automatically.
