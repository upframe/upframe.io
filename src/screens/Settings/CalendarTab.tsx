import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSignOut, useCalendars, useMe } from 'utils/hooks'
import { haveSameContent } from 'utils/array'
import { Title, Text, Labeled } from 'components'
import ChangeBanner from './ChangeBanner'
import Calendar from './Calendar'
import GcalConnect from './GcalConnect'
import CalendarList from './CalendarList'
import { queries, mutations, useQuery, useMutation } from 'gql'
import { hasError } from 'api'
import { notify } from 'notification'
import type * as T from 'gql/types'

type Slot = {
  id: string
  start: Date
  end: Date
}

export default function CalendarTab() {
  const [remoteSlots, setRemoteSlots] = useState<Slot[]>([])
  const [slots, setSlots] = useState(remoteSlots)
  const { me } = useMe()
  const [showCalendars, setShowCalendars] = useState<string[]>([])
  const [calendars, loading] = useCalendars(showCalendars)
  const [extEvents, setExtEvents] = useState<any[]>([])
  const signOut = useSignOut()

  const { data } = useQuery<T.SettingsCalendar>(queries.SETTINGS_CALENDAR, {
    variables: { id: me?.id },
    onError(err) {
      if (hasError(err, 'GOOGLE_ERROR')) {
        notify("couldn't access google calendar")
        signOut()
      }
    },
  })
  const user: T.SettingsCalendar_user_Mentor | undefined =
    data?.user?.__typename === 'Mentor' ? data.user : undefined

  useEffect(() => {
    if (!user || !Array.isArray(user.slots)) return
    setRemoteSlots(
      user.slots.map(({ start: _start, end, id }) => {
        const start = new Date(_start)
        return {
          start,
          end: new Date(end ?? start.getTime() + 30 * 60 * 1000),
          id,
        }
      })
    )
  }, [user])

  useEffect(() => {
    setSlots(remoteSlots)
  }, [remoteSlots])

  useEffect(() => {
    if (!user) return
    setExtEvents(
      calendars.flatMap(({ events, id }) =>
        events.map(({ start, end, name }) => ({
          start: new Date(start),
          end: new Date(end),
          title: name,
          external: true,
          color: (user.google?.calendars ?? []).find(cal => cal.id === id)
            ?.color,
        }))
      )
    )
  }, [calendars, user])

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
    <S.Page>
      {user && (
        <CalendarList
          user={user}
          onChange={setShowCalendars}
          loading={loading}
        />
      )}
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
      <Title size={3}>Google Calendar</Title>
      {/* {user?.calendarConnected ? ( */}
      {user?.google?.gcalGranted ? (
        <Text>
          <Text underlined>{user.google?.email}</Text> is connected to your
          Upframe account
        </Text>
      ) : (
        <Labeled
          wrap={S.GCalInfoWrap}
          label="Connect your calendar to check your availability before adding free slots and see new events directly in your google calendar."
          action={<GcalConnect />}
        />
      )}
      {slotsChanged && <ChangeBanner onSave={saveChanges} />}
    </S.Page>
  )
}

const slotComp = ({ start: s1, end: e1 }: Slot, { start: s2, end: e2 }: Slot) =>
  s1.getTime() === s2.getTime() && e1.getTime() === e2.getTime()
const slotCompTo = (slot1: Slot) => (slot2: Slot) => slotComp(slot1, slot2)

const S = {
  Page: styled.div`
    h2 {
      margin-top: 4rem;
    }
  `,

  GCalInfoWrap: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      margin-left: 2rem;
    }
  `,
}
