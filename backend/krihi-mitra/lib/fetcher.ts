export const fetcher = async <T = unknown,>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) {
    let detail = ""
    try {
      const body = await res.json()
      detail = body?.error || ""
    } catch {
      // ignore
    }
    throw new Error(detail || `Request failed with ${res.status}`)
  }
  return res.json() as Promise<T>
}
