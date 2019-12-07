import { useState, useEffect, useContext } from 'react'
import Api from 'utils/Api'
import context from 'components/AppContext'

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

export const useToast = () => useContext(context).showToast

const blacklist = ['holiday@group', 'contacts@group', 'weeknum@group']
export function useGoogleCalendars(token) {
  const [calendars, setCalendars] = useState([])
  useEffect(() => {
    if (!token) return
    Api.getCalendarList(token).then(({ items }) => setCalendars(items))
  }, [token])
  return calendars.filter(({ id }) => !blacklist.some(v => id.includes(v)))
}

export function useGCalEvents(calendarIds, token) {
  const [events, setEvents] = useState([])
  const [calendars, setCalendars] = useState([])
  const [lock, setLock] = useState(false)
  useEffect(() => {
    if (lock || calendars.length === calendarIds.length || !token) return

    setLock(true)
    Promise.all(calendarIds.map(id => Api.getCalendarEvents(id, token))).then(
      results => {
        setEvents(
          results.flatMap(result =>
            result.items.map(slot => {
              return {
                id: slot.id,
                title: slot.summary,
                start: new Date(slot.start.dateTime || slot.start.date),
                end: new Date(slot.end.dateTime || slot.start.date),
                allDay: 'date' in slot.start,
                external: true,
              }
            })
          )
        )
        setCalendars([...calendarIds])
        setLock(false)
      }
    )
  }, [calendarIds, calendars, events, lock, token])
  return events
}
