import { openDB } from 'idb'

export default null
declare var self: ServiceWorkerGlobalScope

const VERSION = 1
const CACHE_PREFIX = `${self.location.hostname}.v${VERSION}.`
const STATIC_CACHE = CACHE_PREFIX + 'static'
const PHOTO_CACHE = CACHE_PREFIX + 'photo'
const CACHE_OPS = ['Mentors', 'Lists'].map(v => v.toLowerCase())

const expectedCaches = [STATIC_CACHE]

const db = openDB(self.location.hostname, 1, {
  upgrade(db) {
    db.createObjectStore('queries')
  },
})

self.addEventListener('install', event => {
  const cacheStatic = async () => {
    const cache = await caches.open(STATIC_CACHE)
    await caches.open(PHOTO_CACHE)
    const { files } = await fetch('/asset-manifest.json').then(res =>
      res.json()
    )
    let staticFiles = (Object.values(files) as string[]).filter(
      file => !/\.map$/.test(file)
    )

    const html = await fetch('/index.html').then(res => res.text())

    try {
      const head =
        html.match(/(?<=<head(\s+[^>]*)?>).*(?=<\/head>)/is)?.[0] ?? ''
      const links = head.match(/(?<=href=").+?(?=")/gis) ?? []
      staticFiles.push(...links)
    } catch (e) {
      console.warn(e)
    }

    await cache.addAll(Array.from(new Set(staticFiles)))
  }

  event.waitUntil(cacheStatic())
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!expectedCaches.includes(key)) {
            return caches.delete(key)
          }
        })
      )
    )
  )
})

self.addEventListener('fetch', event => {
  const handleDefault = async () => {
    const cache = await caches.open(STATIC_CACHE)
    return (
      (await cache.match(
        event.request.mode === 'navigate' ? '/index.html' : event.request
      )) ?? fetch(event.request)
    )
  }

  const handlePhoto = async () => {
    const cache = await caches.open(PHOTO_CACHE)
    const match = await cache.match(event.request)
    const fetchProm = fetch(event.request).then(res => {
      cache.put(event.request, res.clone())
      return res
    })
    return match ?? fetchProm
  }

  const handlePost = async () => {
    const request = event.request.clone()
    const body = await request.text()
    const { operationName: op } = JSON.parse(body)

    if (!CACHE_OPS.includes(op.toLowerCase())) return fetch(event.request)

    let cached = await (await db).get('queries', op)
    if (cached?.requestBody !== body) cached = null

    const fetchProm = fetch(event.request)

    event.waitUntil(
      db.then(db =>
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
      : event.request.url.startsWith(process.env.PHOTO_BUCKET as string)
      ? handlePhoto()
      : handleDefault()
  )
})
