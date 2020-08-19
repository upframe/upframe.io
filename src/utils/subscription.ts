export default <T>(setup?: () => Function) => {
  let subscribers: ((v: T) => void)[] = []
  let cleanup: Function
  const unsubscribe = (callback: (v: T) => void) => {
    subscribers = subscribers.filter(f => f !== callback)
    if (subscribers.length === 0 && cleanup) cleanup()
  }
  return {
    subscribe(callback: (v: T) => void) {
      if (subscribers.length === 0 && setup) cleanup = setup()
      subscribers.push(callback)
      return () => unsubscribe(callback)
    },
    unsubscribe,
    _call(v: T) {
      subscribers.forEach(f => f(v))
    },
    get requested() {
      return subscribers.length > 0
    },
  }
}
