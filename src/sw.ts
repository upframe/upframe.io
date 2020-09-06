export default null
declare var self: ServiceWorkerGlobalScope

self.addEventListener('install', () => {
  console.log('sw install')
})

self.addEventListener('activate', () => {
  console.log('sw active')
})

self.addEventListener('message', event => {
  console.log(event)
})
