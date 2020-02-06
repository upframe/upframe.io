import React from 'react'
import styles from './profile.module.scss'

export default function Slot({ start, onClick }) {
  const date = new Date(start)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.toLocaleString('en-US', { day: 'numeric' })
  const weekday = date.toLocaleString('en-US', { weekday: 'short' })
  const time = date.toLocaleString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <div className={styles.slot} onClick={() => onClick(start)}>
      <div>
        <span>{month}</span>
        <span>{day}</span>
      </div>
      <div>
        <span>
          {weekday} {time}
        </span>
      </div>
    </div>
  )
}
