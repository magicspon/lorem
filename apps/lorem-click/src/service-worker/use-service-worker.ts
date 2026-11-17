import { useEffect } from 'react'

/**
 * Registers `/sw.js` once the page has loaded, so the app works offline from
 * the next visit. Only in a build: dev serves no worker, and one left behind
 * would serve stale files.
 */
export function useServiceWorker(): void {
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
    // A failure leaves the app working online, so it is not shown.
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  }, [])
}
