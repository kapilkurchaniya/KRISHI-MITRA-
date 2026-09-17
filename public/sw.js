// AI Krishi — service worker
// Network-first for HTML, cache-first for assets, offline fallback page.
const VERSION = "v1.0.0"
const RUNTIME_CACHE = `ai-krishi-runtime-${VERSION}`
const PRECACHE = `ai-krishi-precache-${VERSION}`
const PRECACHE_URLS = ["/", "/offline", "/manifest.webmanifest"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== PRECACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)

  // Never cache Supabase or Auth
  if (
    url.pathname.startsWith("/api/auth/") ||
    url.pathname.startsWith("/auth/") ||
    url.host.includes("supabase.co")
  ) {
    return
  }

  // Network-first for API requests (Weather, Mandi, Profile)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached
            // Return empty JSON fallback for API endpoints if no cache
            return new Response(JSON.stringify({ error: "offline", offline: true }), {
              headers: { "Content-Type": "application/json" }
            })
          })
        })
    )
    return
  }

  // Network-first for navigations / HTML
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/offline"))),
    )
    return
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone()
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy))
          }
          return res
        })
        .catch(() => caches.match("/offline"))
    }),
  )
})
