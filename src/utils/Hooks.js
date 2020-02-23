import { useState, useEffect, useContext } from 'react'
import Api from 'utils/Api'
import context from '../context'
import debounce from 'lodash/debounce'
import { useHistory } from 'react-router-dom'
import { useQuery, queries } from '../gql'

export function useUser() {
  const [user, setUser] = useState()
  useEffect(() => {
    async function getUser() {
      const { user } = await Api.getUserInfo()
      setUser(user)
    }
    getUser()
  }, [])
  return user
}

const blacklist = ['holiday@group', 'contacts@group', 'weeknum@group']
export function useGoogleCalendars(token) {
  const [calendars, setCalendars] = useState([])
  useEffect(() => {
    if (!token) return
    Api.getCalendarList(token).then(({ items }) => setCalendars(items))
  }, [token])
  return (calendars || []).filter(
    ({ id }) => !blacklist.some(v => id.includes(v))
  )
}

export function useScrollAtTop() {
  const [atTop, setAtTop] = useState(window.scrollY === 0)

  useEffect(() => {
    function handleScrollStart() {
      setAtTop(false)
      window.addEventListener('scroll', handleScrollStop, { passive: true })
    }

    const handleScrollStop = debounce(
      () => {
        if (window.scrollY !== 0) return
        setAtTop(true)
        window.removeEventListener('scroll', handleScrollStop)
        window.addEventListener('scroll', handleScrollStart, {
          passive: true,
          once: true,
        })
      },
      100,
      { leading: false, trailing: true }
    )

    window.addEventListener('scroll', handleScrollStart, {
      passive: true,
      once: true,
    })
    return () =>
      window.removeEventListener(
        'scroll',
        window.scrollY === 0 ? handleScrollStart : handleScrollStop
      )
  }, [])

  return atTop
}

export const useCtx = () => useContext(context)

export function useCalendars(requested) {
  const [calNotFetched, setCalNotFetched] = useState([])
  const [calendars, setCalendars] = useState([])

  const {
    data: { me: { calendars: gcals = [] } = {} } = {},
    loading,
  } = useQuery(queries.GCAL_EVENTS, {
    variables: { calendarIds: calNotFetched },
  })

  useEffect(() => {
    if (loading) return
    const diff = requested.filter(id => !calendars.find(cal => cal.id === id))
    const missing = diff.filter(id => !calNotFetched.includes(id))
    if (missing.length > 0) setCalNotFetched([...calNotFetched, ...missing])
    const remove = calendars.filter(({ id }) => !requested.includes(id))
    if (remove.length > 0)
      setCalendars(
        calendars.filter(({ id }) => !remove.find(cal => cal.id === id))
      )
  }, [requested, calendars, calNotFetched, loading])

  useEffect(() => {
    if (loading) return
    const newlyFetched = gcals.filter(
      ({ id }) =>
        !calendars.find(cal => cal.id === id) && requested.includes(id)
    )
    if (newlyFetched.length === 0) return
    setCalendars([...calendars, ...newlyFetched])
    setCalNotFetched(
      calNotFetched.filter(id => !calendars.find(cal => cal.id === id))
    )
  }, [loading, gcals, calendars, calNotFetched, requested])

  return calendars
}

export { useHistory }
