import React from 'react'
import styled from 'styled-components'
import Slot from './Slot'

interface SlotsI {
  slotDays: Array<Array<any>>
  selectedDay: any
  selectedSlot: any
  setSelectedSlot(value: any): void
}

export default function Slots({
  slotDays,
  selectedSlot,
  setSelectedSlot,
  selectedDay,
}: SlotsI) {
  return (
    <SlotsS>
      <>
        {slotDays[selectedDay][1]
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          )
          .map(slot => (
            <Slot
              selected={selectedSlot && slot.start === selectedSlot.start}
              key={slot.start}
              start={slot.start}
              onClick={async () => {
                setSelectedSlot(slot)
                await setTimeout(
                  () =>
                    window.scrollTo({
                      left: 0,
                      top: document.body.scrollHeight,
                      behavior: 'smooth',
                    }),
                  200
                )
              }}
            />
          ))}
      </>
    </SlotsS>
  )
}

const SlotsS = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.5rem;

  button {
    height: 4rem;
    width: 11rem;

    &:hover {
      transform: scale(1.01);
      opacity: 0.7;
      background: rgba(255, 32, 92, 0.8);
    }
  }

  & > * {
    box-sizing: border-box;
  }
`
