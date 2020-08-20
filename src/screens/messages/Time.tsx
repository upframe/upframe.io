import React from 'react'
import styled from 'styled-components'
import { ordNum, isSameDay, isPreviousDay } from 'utils/date'

interface Props {
  children: Date
}

function Time({ children: date }: Props) {
  let suffix = 'AM'
  let hour = date.getHours()
  if (hour >= 12) {
    if (hour >= 13) hour -= 12
    suffix = 'PM'
  }
  let minute = `0${date.getMinutes()}`.substr(-2)
  let second = `0${date.getSeconds()}`.substr(-2)

  let month = date.toLocaleString('en-US', { month: 'short' })

  let dateComp = `${month} ${ordNum(date.getDate())}`

  if (Date.now() - date.getTime() <= 1000 * 60 ** 2 * 24 * 2) {
    if (isSameDay(date)) dateComp = 'Today'
    else if (isPreviousDay(date)) dateComp = 'Yesterday'
  }

  const full = `${dateComp} at ${hour}:${minute}:${second} ${suffix}`

  return (
    <S.Date title={full}>
      {hour}:{minute} {suffix}
    </S.Date>
  )
}

const S = {
  Date: styled.abbr`
    text-decoration: none;
    color: #0004;
    font-size: 14px;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  `,
}

export default Object.assign(Time, { sc: S.Date })
