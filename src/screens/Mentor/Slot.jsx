import React from 'react'
import styles from './profile.module.scss'

export default function Slot({ start, onClick = () => {}, linkTo }) {
  const date = new Date(start)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.toLocaleString('en-US', { day: 'numeric' })
  const weekday = date.toLocaleString('en-US', { weekday: 'short' })
  const time = date.toLocaleString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  })

  let Tag = linkTo ? 'a' : 'div'

  return (
    <Tag
      className={styles.slot}
      onClick={() => onClick(start)}
      {...(linkTo && {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: linkTo,
      })}
    >
      <div>
        <span>{month}</span>
        <span>{day}</span>
      </div>
      <div>
        <span>
          {weekday} {time}
        </span>
      </div>
    </Tag>
  )
}
