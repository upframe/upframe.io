import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { useToast } from 'utils/Hooks'

import styles from './calendar.module.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment)

export default function Calendar({ slots, onAddSlot, onDeleteSlot }) {
  const showToast = useToast()

  function addSlot(newSlot) {
    if (
      newSlot.start.getTime() < Date.now() ||
      slots.some(
        slot =>
          newSlot.end.getTime() > slot.start.getTime() &&
          slot.end.getTime() > newSlot.start.getTime()
      )
    ) {
      showToast("You can't add a slot there!")
      return
    }
    onAddSlot({ start: newSlot.start, end: newSlot.end })
  }

  function deleteSlot(deleted) {
    const slot = slots.find(
      ({ start, end }) =>
        deleted.start.getTime() === start.getTime() &&
        deleted.end.getTime() === end.getTime()
    )
    if (slot) onDeleteSlot(slot)
  }

  return (
    <div className={styles.calendar}>
      <BigCalendar
        localizer={localizer}
        selectable
        defaultView="week"
        events={slots}
        onSelectSlot={addSlot}
        onSelectEvent={deleteSlot}
      />
    </div>
  )
}
