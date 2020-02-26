let subscribers = []

export const subscribe = handler => {
  if (!subscribers.includes(handler)) subscribers.push(handler)
}
export const unsubscribe = handler => {
  subscribers = subscribers.filter(func => func !== handler)
}

export const notify = msg => subscribers.forEach(func => func(msg))

window.notify = notify

export let pad = () => {}
export const setPad = (func = () => {}) => {
  pad = func
}
