export default null
declare var self: ServiceWorkerGlobalScope

self.addEventListener('install', (event: any) => {
  console.log('hello from service worker')
})
