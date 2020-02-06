import React from 'react'
import { Text } from 'components'
import styles from './chip.module.scss'

export default function Chip({ children, onClick, removable = true }) {
  return (
    <div className={styles.chip} onClick={() => onClick(children)}>
      <Text>{children}</Text>
      {removable && <span>×</span>}
    </div>
  )
}
