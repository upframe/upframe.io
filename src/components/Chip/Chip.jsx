import React from 'react'
import { Text } from 'components'
import styles from './chip.module.scss'

export default function Chip({
  children,
  onClick = () => {},
  removable = true,
  highlight,
}) {
  return (
    <div
      className={styles.chip}
      onClick={() => onClick(children)}
      {...(highlight && { 'data-highlight': true })}
    >
      <Text>{children}</Text>
      {removable && <span>×</span>}
    </div>
  )
}
