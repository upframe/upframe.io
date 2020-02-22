import React, { useState, useEffect } from 'react'
import { useCtx } from 'utils/Hooks'
import { haveSameContent } from 'utils/Array'
import { Title, Text } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import Calendar from './Calendar'
import GoogleSync from './GoogleSync'
import CalendarList from './CalendarList'
import styles from './calendarTab.module.scss'
import { queries, mutations, useQuery, useMutation } from '../../gql'

export default function CalendarTab() {
  const [remoteSlots, setRemoteSlots] = useState([])
  const [slots, setSlots] = useState(remoteSlots)
  const { currentUser } = useCtx()

  const { data: { mentor: user = {} } = {} } = useQuery(queries.SLOTS, {
    variables: { id: currentUser },
  })

  useEffect(() => {
    if (!Array.isArray(user.slots)) return
    setRemoteSlots(
      user.slots.map(({ start, duration = 30, id }) => {
        start = new Date(start)
        return {
          start,
          end: new Date(start.getTime() + duration * 60 * 1000),
          id,
        }
      })
    )
  }, [user.slots])

  useEffect(() => {
    setSlots(remoteSlots)
  }, [remoteSlots])

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
      <CalendarList gCals={[]} onChange={() => {}} />
      <Calendar
        slots={slots}
        onAddSlot={slot => setSlots([...slots, slot])}
        onDeleteSlot={deleted =>
          setSlots(slots.filter(slot => slot !== deleted))
        }
        gCals={[]}
        gToken={user.googleAccessToken}
      />
      <Title s2>Calendar Connections</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item label="Google Calendar" custom={<GoogleSync />}>
        {user.googleAccessToken ? (
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
