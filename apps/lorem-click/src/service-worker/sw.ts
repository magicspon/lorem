// The service worker, built to `/sw.js` by `serviceWorker()` in
// `vite-plugin.ts`. It keeps the shell and every built file, so the app opens
// and makes text with no network. It runs in its own global scope, so it
// imports nothing.

/** The slice of a service worker's events this file uses. */
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void
}

interface FetchEvent extends ExtendableEvent {
  readonly request: Request
  respondWith(response: Promise<Response>): void
}

interface ServiceWorkerScope {
  readonly clients: { claim(): Promise<void> }
  addEventListener(
    type: 'install' | 'activate',
    fn: (event: ExtendableEvent) => void,
  ): void
  addEventListener(type: 'fetch', fn: (event: FetchEvent) => void): void
}

// The DOM types give `self` as a window. This module's `self` shadows it with
// the worker's own scope; the empty export makes the file a module, so it can.
declare const self: ServiceWorkerScope
export {}

// Replaced at build with the files to keep, as a JSON string. The address
// `/` is the shell: every page, since the home route renders only in the
// browser.
const precache: readonly string[] = JSON.parse('__PRECACHE_MANIFEST__')
const shell = '/'

// The list changes with every build that changes a file, so the cache name
// does too, and a new worker never serves an old build's files.
const cacheName = `lorem-${hash(precache.join('\n'))}`

function hash(text: string): string {
  let h = 0
  for (let i = 0; i < text.length; i += 1) {
    h = (Math.imul(31, h) + text.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([shell, ...precache])),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== cacheName)
            .map((name) => caches.delete(name)),
        ),
      )
      // Takes the page that installed it, so the first visit works offline
      // after it. No `skipWaiting`: a page keeps the build it opened with.
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== location.origin) return

  if (request.mode === 'navigate') {
    // The network first, for a new build; offline, the kept shell, whatever
    // the query.
    event.respondWith(fetch(request).catch(() => fromCache(shell)))
    return
  }

  // Built files are hashed, so a kept copy is never stale.
  if (precache.includes(url.pathname)) {
    event.respondWith(fromCache(url.pathname).catch(() => fetch(request)))
  }
})

async function fromCache(path: string): Promise<Response> {
  const cache = await caches.open(cacheName)
  const response = await cache.match(path)
  if (response === undefined) throw new Error(`${path} is not cached`)
  return response
}
