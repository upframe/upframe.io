import React, { useState, useEffect } from 'react'
import { useCtx, useSignOut, useCalendars, useHistory } from 'utils/hooks'
import { haveSameContent } from 'utils/array'
import { Title, Text } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import Calendar from './Calendar'
import GoogleSync from './GoogleSync'
import CalendarList from './CalendarList'
import styles from './calendarTab.module.scss'
import { queries, mutations, useQuery, useMutation } from 'gql'
import { hasError } from 'api'
import { notify } from 'notification'

export default function CalendarTab() {
  const [remoteSlots, setRemoteSlots] = useState([])
  const [slots, setSlots] = useState(remoteSlots)
  const { currentUser } = useCtx()
  const [showCalendars, setShowCalendars] = useState([])
  const [calendars, loading] = useCalendars(showCalendars)
  const [extEvents, setExtEvents] = useState([])
  const history = useHistory()
  const signOut = useSignOut()

  const { data: { mentor: user = {} } = {} } = useQuery(
    queries.SETTINGS_CALENDAR,
    {
      variables: { id: currentUser },
      onError(err) {
        if (hasError(err, 'GOOGLE_ERROR')) {
          notify("couldn't access google calendar")
          signOut()
        }
      },
    }
  )

  const [connect, { loading: connecting }] = useMutation(
    mutations.CONNECT_CALENDAR
  )

  const code = new URLSearchParams(window.location.search).get('code')
  useEffect(() => {
    if (!code || !history || !connect) return
    connect({
      variables: {
        code,
        redirect: window.location.origin + window.location.pathname,
      },
    })
    history.replace(window.location.pathname)
  }, [code, history, connect])

  useEffect(() => {
    if (!Array.isArray(user.slots)) return
    setRemoteSlots(
      user.slots.map(({ start, end, id }) => ({
        start: new Date(start),
        end: new Date(end),
        id,
      }))
    )
  }, [user.slots])

  useEffect(() => {
    setSlots(remoteSlots)
  }, [remoteSlots])

  useEffect(() => {
    setExtEvents(
      calendars.flatMap(({ events, id }) =>
        events.map(({ start, end, name }) => ({
          start: new Date(start),
          end: new Date(end),
          title: name,
          external: true,
          color: (user.calendars || []).find(cal => cal.id === id).color,
        }))
      )
    )
  }, [calendars, user.calendars])

  const slotsChanged = !haveSameContent(remoteSlots, slots, slotComp)

  const [updateSlots] = useMutation(mutations.UPDATE_SLOTS)

  async function saveChanges() {
    if (haveSameContent(remoteSlots, slots)) return
    updateSlots({
      variables: {
        added: slots
          .filter(slot => !remoteSlots.find(slotCompTo(slot)))
          .map(({ start }) => ({ start })),
        deleted: remoteSlots
          .filter(slot => !slots.find(slotCompTo(slot)))
          .map(({ id }) => id),
      },
    })
  }

  return (
    <div className={styles.calendarTab}>
      <CalendarList
        user={user}
        onChange={setShowCalendars}
        loading={loading}
        connecting={connecting}
      />
      <Calendar
        slots={slots}
        onAddSlot={slot => setSlots([...slots, slot])}
        onDeleteSlot={deleted =>
          setSlots(slots.filter(slot => slot !== deleted))
        }
        external={extEvents}
      />
      <Title s2>Calendar Connections</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item
        label="Google Calendar"
        custom={<GoogleSync loading={connecting} />}
      >
        {user.calendarConnected ? (
          <Text>
            <Text underlined>{user.email}</Text> is connected to your Upframe
            account
          </Text>
        ) : (
          'Connect your calendar to check your availability before adding free slots and see new events directly in your google calendar.'
        )}
      </Item>
      {slotsChanged && <ChangeBanner onSave={saveChanges} />}
    </div>
  )
}

const slotComp = ({ start: s1, end: e1 }, { start: s2, end: e2 }) =>
  s1.getTime() === s2.getTime() && e1.getTime() === e2.getTime()
const slotCompTo = slot1 => slot2 => slotComp(slot1, slot2)
