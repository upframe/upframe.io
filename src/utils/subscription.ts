export default <T>(setup?: (...args: any[]) => Function | void) => {
  let subscribers: ((v: T) => void)[] = []
  let cleanup: Function | void
  const unsubscribe = (callback: (v: T) => void) => {
    subscribers = subscribers.filter(f => f !== callback)
    if (subscribers.length === 0 && cleanup) cleanup()
  }
  let _state: T
  return {
    subscribe(callback: (v: T) => void, ...setupArgs: any[]) {
      if (subscribers.length === 0 && setup) cleanup = setup(...setupArgs)
      subscribers.push(callback)
      return () => unsubscribe(callback)
    },
    unsubscribe,
    _call(v: T) {
      _state = v
      subscribers.forEach(f => f(v))
    },
    get requested() {
      return subscribers.length > 0
    },
    get state() {
      return _state
    },
  }
}
