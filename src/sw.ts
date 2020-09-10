import { openDB, DBSchema } from 'idb'

export default null
declare var self: ServiceWorkerGlobalScope

const VERSION = 1
const CACHE_PREFIX = `${self.location.hostname}.v${VERSION}.`
const STATIC_CACHE = CACHE_PREFIX + 'static'
const PHOTO_CACHE = CACHE_PREFIX + 'photo'
const CACHE_OPS = ['Mentors', 'Lists'].map(v => v.toLowerCase())

const expectedCaches = [STATIC_CACHE, PHOTO_CACHE]

const IS_LOCAL = ['localhost', '127.0.0.1'].includes(self.location.hostname)

interface UpframeDB extends DBSchema {
  queries: {
    key: string
    value: {
      status: number
      statusText: string
      headers: { [k: string]: string }
      responseBody: Blob
      requestBody: string
    }
  }
  meta: {
    key: 'updateStatus'
    value: 'UP_TO_DATE' | 'EVICT_PENDING'
  }
}

const dbProm = openDB<UpframeDB>(self.location.hostname, 1, {
  upgrade(db) {
    db.createObjectStore('queries')
    db.createObjectStore('meta').put('UP_TO_DATE', 'updateStatus')
  },
})

self.addEventListener('install', event => {
  if (IS_LOCAL) return
  event.waitUntil(cacheStatic())
})

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (!expectedCaches.includes(key)) {
              return caches.delete(key)
            }
          })
        )
      ),
    ])
  )
})

self.addEventListener('fetch', event => {
  const handleDefault = async () => {
    if (IS_LOCAL) return fetch(event.request)
    const cache = await caches.open(STATIC_CACHE)
    const isNav = event.request.mode === 'navigate'
    if (isNav) event.waitUntil(checkForUpdate())
    return (
      (await cache.match(isNav ? '/index.html' : event.request)) ??
      fetch(event.request)
    )
  }

  const handlePhoto = async () => {
    const cache = await caches.open(PHOTO_CACHE)
    const match = await cache.match(event.request)
    const fetchProm = fetch(event.request).then(res => {
      cache.put(event.request, res.clone())
      return res
    })
    event.waitUntil(fetchProm)
    return match ?? fetchProm
  }

  const handlePost = async () => {
    const request = event.request.clone()
    const body = await request.text()
    const { operationName: op } = JSON.parse(body)

    if (!CACHE_OPS.includes(op.toLowerCase())) return fetch(event.request)

    let cached = await (await dbProm).get('queries', op)
    if (cached?.requestBody !== body) cached = undefined

    const fetchProm = fetch(event.request)

    event.waitUntil(
      dbProm.then(db =>
        fetchProm.then(res => {
          const response = res.clone()
          response.blob().then(responseBody => {
            let { status, statusText, headers } = response
            return db.put(
              'queries',
              {
                status,
                statusText,
                headers: Object.fromEntries(headers.entries()),
                responseBody,
                requestBody: body,
              },
              op
            )
          })
        })
      )
    )

    if (!cached) return fetchProm
    const { responseBody, ...rest } = cached
    return new Response(responseBody, rest)
  }

  event.respondWith(
    event.request.method === 'POST'
      ? handlePost()
      : event.request.url.startsWith(
          process.env.REACT_APP_PHOTO_BUCKET as string
        )
      ? handlePhoto()
      : handleDefault()
  )
})

async function cacheStatic() {
  const [cache, staticFiles] = await Promise.all([
    caches.open(STATIC_CACHE),
    getStatic(),
  ])
  await cache.addAll(staticFiles)
}

async function getStatic() {
  const { files } = await fetch('/asset-manifest.json').then(res => res.json())
  let staticFiles = (Object.values(files) as string[]).filter(
    file => !/\.map$/.test(file)
  )

  const html = await fetch('/index.html').then(res => res.text())

  try {
    const head = html.match(/(?<=<head(\s+[^>]*)?>).*(?=<\/head>)/is)?.[0] ?? ''
    const links = head.match(/(?<=href=").+?(?=")/gis) ?? []
    staticFiles.push(...links)
  } catch (e) {
    console.warn(e)
  }

  return Array.from(new Set(staticFiles))
}

async function checkForUpdate() {
  const db = await dbProm
  const updateStatus = await db.get('meta', 'updateStatus')

  if (updateStatus === 'UP_TO_DATE') {
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match('/index.html')
    if (!cached) return
    const latest = await fetch('/index.html').then(res => res.text())
    if ((await cached.text()) !== latest) {
      await cacheStatic()
      await db.put('meta', 'EVICT_PENDING', 'updateStatus')
      const clients = await self.clients.matchAll()
      clients.forEach(client =>
        client.postMessage?.({ type: 'UPDATE_AVAILABLE' })
      )
    }
  } else if (updateStatus === 'EVICT_PENDING') {
    const staticFiles = await getStatic()
    const cache = await caches.open(STATIC_CACHE)
    const keys = await cache.keys()
    const toEvict = keys.filter(
      ({ url }) => !staticFiles.includes(url.replace(self.location.origin, ''))
    )
    await Promise.all(toEvict.map(v => cache.delete(v)))
    await db.put('meta', 'UP_TO_DATE', 'updateStatus')
  }
}
