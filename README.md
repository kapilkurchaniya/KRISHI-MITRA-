# KRISHI MITRA

A production-ready agricultural assistant built with Next.js, React, Supabase, and AI-powered crop and chat features.

## Overview

`KRISHI MITRA` provides farmers with:

- AI chat support for farming advice, pests, irrigation, crop health, and schemes
- Image-based crop scanning with smart detection, disease analysis, and treatment recommendations
- Real-time weather forecasts and location-aware updates
- Mandi price charts for major crops
- Farm alerts and notifications
- Hindi/English language support
- Dark/light theme support
- Mobile-friendly responsive UI

## Key Features

- **AI-driven chat assistant** with streaming responses and personalized guidance
- **Crop scanner** with image upload or camera capture
- **Weather dashboard** with current conditions and 7-day forecast
- **Mandi price tracker** for major crop markets
- **Multi-language support**: English and Hindi
- **Mobile-ready design** with bottom navigation and camera capture

## Tech Stack

- Next.js 16.2.4
- React 19
- Supabase
- Tailwind CSS 4
- TypeScript
- `@radix-ui/react` components
- AI integrations via Google Gemini and custom backend APIs

## Getting Started

### Install dependencies

```bash
cd "c:\Users\pawan\OneDrive\Desktop\protfolio.kapil\backend\krihi-mitra"
corepack pnpm install
```

### Run locally

```bash
corepack pnpm dev
```

Then open: `http://localhost:3000`

### Build for production

```bash
corepack pnpm build
```

### Start production server

```bash
corepack pnpm start
```

## Environment Variables

Copy or configure a `.env` file for local development and production.

Required variables:

```env
GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-key>
OPENWEATHER_API_KEY=<your-openweather-key>
```

## Important Notes

- The `.env` file should never be committed to source control.
- The project already includes an example file at `.env.production.example`.
- If using GitHub, ensure secret scanning rules do not block pushes for sensitive files.

## Project Structure

- `app/` — Next.js application routes and pages
- `components/` — Shared UI components and providers
- `lib/` — Utility functions, API fetchers, and types
- `public/` — Static assets and icons
- `styles/` — Global CSS styles

## Documentation

Additional documentation is available in:

- `COMPLETE_FEATURES_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `FINAL_SUMMARY.md`
- `KRISHI_SETUP_GUIDE.md`
- `QUICK_REFERENCE.md`
- `README-ANDROID.md`

## License

This repository is private and configured for project development.
