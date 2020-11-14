import React, { useState, useEffect } from 'react'
import { useSignOut, useCalendars, useMe } from 'utils/hooks'
import { haveSameContent } from 'utils/array'
import { Title, Text } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import Calendar from './Calendar'
import GcalConnect from './GcalConnect'
import CalendarList from './CalendarList'
import styles from './calendarTab.module.scss'
import { queries, mutations, useQuery, useMutation } from 'gql'
import { hasError } from 'api'
import { notify } from 'notification'

export default function CalendarTab() {
  const [remoteSlots, setRemoteSlots] = useState([])
  const [slots, setSlots] = useState(remoteSlots)
  const { me } = useMe()
  const [showCalendars, setShowCalendars] = useState([])
  const [calendars, loading] = useCalendars(showCalendars)
  const [extEvents, setExtEvents] = useState([])
  const signOut = useSignOut()

  const { data: { user = {} } = {} } = useQuery(queries.SETTINGS_CALENDAR, {
    variables: { id: me.id },
    onError(err) {
      if (hasError(err, 'GOOGLE_ERROR')) {
        notify("couldn't access google calendar")
        signOut()
      }
    },
  })

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
      <CalendarList user={user} onChange={setShowCalendars} loading={loading} />
      <Calendar
        slots={slots}
        onAddSlot={slot => setSlots([...slots, slot])}
        onDeleteSlot={deleted =>
          setSlots(slots.filter(slot => slot !== deleted))
        }
        external={extEvents}
      />
      <Title size={2}>Calendar Connections</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item label="Google Calendar" custom={<GcalConnect loading={loading} />}>
        {user.calendarConnected ? (
          <Text>
            <Text underlined>{user.google?.email}</Text> is connected to your
            Upframe account
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
