import { useState, useEffect } from 'react'

export function useMatchMedia(query) {
  const [match, setMatch] = useState(null)

  function handleEvent(e) {
    setMatch(e.matches)
  }

  useEffect(() => {
    const mql = window.matchMedia(query)
    handleEvent(mql)
    mql.onchange = handleEvent

    return () => {
      mql.onchange = null
    }
  })

  return match
}
