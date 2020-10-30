import React from 'react'
import styled from 'styled-components'
import { WEEK_DAYS } from '../../utils/date'

interface DayI {
  date: number
  day: number
  disabled: boolean
  selected: boolean
  onClick(event: any): void
}

export default function Day({ date, day, onClick, disabled, selected }: DayI) {
  return (
    <DayContainer
      disabled={disabled}
      selected={selected}
      onClick={disabled ? undefined : onClick}
    >
      <span>{date}</span>
      <span>{WEEK_DAYS[day].slice(0, 3)}</span>
    </DayContainer>
  )
}

const DayContainer = styled.div<{ selected: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-weight: bold;
  align-items: center;
  height: 100px;
  min-width: 75px;
  border-radius: 15px;
  background-color: #feeef2;
  color: var(--cl-accent);
  scroll-snap-align: start;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
  background-color: var(--cl-accent);
  color: white;
  cursor: pointer;
`}

  ${({ disabled }) =>
    disabled &&
    `
  background-color: white;
  color: grey;
  cursor: unset;
`}
`
