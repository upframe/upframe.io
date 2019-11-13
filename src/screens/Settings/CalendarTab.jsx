import React, { useState, useEffect } from 'react'
import { useToast, useUser } from 'utils/Hooks'
import Api from 'utils/Api'
import { haveSameContent } from 'utils/Array'

import Calendar from './Calendar'
import GoogleSync from './GoogleSync'

export default function SettingsSyncTab() {
  const user = useUser()
  const [oldSlots, setOldSlots] = useState([])
  const [slots, setSlots] = useState(oldSlots)
  const slotsChanged = !haveSameContent(oldSlots, slots, slotComp)
  const showToast = useToast()

  useEffect(() => {
    async function getSlots() {
      let { slots } = await Api.getFreeSlots()
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
    const { ok } = await Api.addFreeSlots(added, deleted)
    if (ok) setOldSlots(slots)
    else showToast('something went wrong')
  }

  return (
    <div>
      <GoogleSync user={user} />
      <Calendar
        slots={slots}
        onAddSlot={slot => setSlots([...slots, slot])}
        onDeleteSlot={deleted =>
          setSlots(slots.filter(slot => slot !== deleted))
        }
      />
      {slotsChanged && (
        <div className="fixed-save-changes">
          <button
            id="save-button"
            className="btn btn-fill btn-primary block save-changes"
            onClick={saveChanges}
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  )
}

const slotComp = ({ start: s1, end: e1 }, { start: s2, end: e2 }) =>
  s1.getTime() === s2.getTime() && e1.getTime() === e2.getTime()
const slotCompTo = slot1 => slot2 => slotComp(slot1, slot2)
