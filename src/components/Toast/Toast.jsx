import React, { useState, useEffect } from 'react'
import styles from './toast.module.scss'
import { Text } from '..'

export default function Toast({ msg }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(false), 5000)
  })

  if (!visible) return null
  return (
    <div className={styles.toast}>
      <Text>{msg}</Text>
    </div>
  )
}
