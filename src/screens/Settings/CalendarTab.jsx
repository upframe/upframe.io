import React, { useState, useEffect, useContext } from 'react'
import AppContext from 'components/AppContext'
import { useToast, useGoogleCalendars } from 'utils/Hooks'
import Api from 'utils/Api'
import { haveSameContent } from 'utils/Array'
import { Title, Text } from 'components'
import Item from './Item'
import ChangeBanner from './ChangeBanner'
import Calendar from './Calendar'
import GoogleSync from './GoogleSync'
import CalendarList from './CalendarList'
import styles from './calendarTab.module.scss'

export default function CalendarTab() {
  const [oldSlots, setOldSlots] = useState([])
  const [slots, setSlots] = useState(oldSlots)
  const ctx = useContext(AppContext)
  const gCals = useGoogleCalendars(
    ctx && ctx.user && ctx.user.googleAccessToken
  )
  const [showCals, setShowCals] = useState([])
  const slotsChanged = !haveSameContent(oldSlots, slots, slotComp)
  const showToast = useToast()

  useEffect(() => {
    async function getSlots() {
      const now = new Date()
      let { slots } = await Api.getFreeSlots(
        now.toDateString(),
        new Date(now.setMonth(now.getMonth() + 1)).toDateString()
      )
      slots = (slots || []).map(({ start, end, sid: id }) => ({
        id,
        start: new Date(start),
        end: new Date(end),
      }))
      setOldSlots(slots)
      setSlots(slots)
    }
    getSlots()
  }, [])

  async function saveChanges() {
    if (haveSameContent(oldSlots, slots)) return
    const added = slots.filter(slot => !oldSlots.find(slotCompTo(slot)))
    const deleted = oldSlots.filter(slot => !slots.find(slotCompTo(slot)))
    addTimezone(added)
    const { ok } = await Api.addFreeSlots(added, deleted)
    if (ok) setOldSlots(slots)
    else showToast('something went wrong')
  }

  return (
    <div className={styles.calendarTab}>
      <CalendarList gCals={gCals} onChange={setShowCals} />
      <Calendar
        slots={slots}
        onAddSlot={slot => setSlots([...slots, slot])}
        onDeleteSlot={deleted =>
          setSlots(slots.filter(slot => slot !== deleted))
        }
        gCals={gCals.filter(({ summary }) => showCals.includes(summary))}
        gToken={ctx && ctx.user && ctx.user.googleAccessToken}
      />
      <Title s2>Calendar Connections</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item label="Google Calendar" custom={<GoogleSync />}>
        {ctx.user.googleAccessToken ? (
          <Text>
            <Text underlined>{ctx.user.email}</Text> is connected to your
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

const addTimezone = slots => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (slots) {
    slots.map(slot => (slot.timeZone = timeZone))
  }
}
