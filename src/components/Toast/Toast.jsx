import React, { useEffect } from 'react'
import styles from './toast.module.scss'
import { Text } from '..'
import { useCtx } from '../../utils/Hooks'

export default function Toast() {
  const { toast, showToast } = useCtx()

  useEffect(() => {
    if (!showToast || !toast) return
    setTimeout(() => showToast(null), 2000)
  }, [showToast, toast])

  return (
    <div
      className={styles.toast}
      data-state={toast === null ? 'hidden' : 'visible'}
    >
      <Text>{toast}</Text>
    </div>
  )
}
