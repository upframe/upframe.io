export default null
declare var self: ServiceWorkerGlobalScope

const VERSION = 1
const CACHE_PREFIX = `${self.location.hostname}.v${VERSION}.`
const STATIC_CACHE = CACHE_PREFIX + 'static'
const PHOTO_CACHE = CACHE_PREFIX + 'photo'

const expectedCaches = [STATIC_CACHE]

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

  event.respondWith(
    event.request.url.startsWith(process.env.PHOTO_BUCKET as string)
      ? handlePhoto()
      : handleDefault()
  )
})
