"use client"

import { useEffect, useState } from "react"
import { detectCurrentLocation } from "./geolocation"
import type { LocationInfo } from "./types"

const STORAGE_KEY = "ai-krishi:last-location"

export function useAutoLocation() {
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function run() {
      try {
        // Restore previous location instantly so SWR can fire while we re-detect
        const cached = localStorage.getItem(STORAGE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as LocationInfo
            if (active) setLocation(parsed)
          } catch {
            // ignore
          }
        }

        const fresh = await detectCurrentLocation()
        if (active) {
          setLocation(fresh)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Could not detect location")
      } finally {
        if (active) setLoading(false)
      }
    }

    run()
    return () => {
      active = false
    }
  }, [])

  return { location, loading, error, setLocation }
}
