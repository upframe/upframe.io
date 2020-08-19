import { useState, useEffect } from 'react'

let navActions: JSX.Element[] | null = null
const subscribers: (() => void)[] = []

export function useNavActions(v: typeof navActions) {
  const [actions, setActions] = useState<typeof navActions>(navActions)

  function show() {
    navActions = v
    subscribers.forEach(handler => handler())
  }
  function hide() {
    navActions = null
    subscribers.forEach(handler => handler())
  }

  useEffect(() => {
    const onChange = () => {
      setActions(navActions)
    }
    subscribers.push(onChange)
    return () => void subscribers.splice(subscribers.indexOf(onChange), 1)
  }, [])

  return { show, hide, actions }
}
