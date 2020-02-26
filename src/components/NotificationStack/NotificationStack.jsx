import React, { useState, useEffect, useRef } from 'react'
import styles from './stack.module.scss'
import { Toast } from '..'
import { subscribe, unsubscribe, setPad } from '../../notification'

export default function NotificationStack() {
  const [notifications, setNotifications] = useState([])
  const [notification, setNotification] = useState()
  const ref = useRef()

  useEffect(() => {
    if (!notification) return
    setNotifications([
      {
        msg: notification.message || notification,
        key: performance.now(),
      },
      ...notifications.filter(({ key }) => performance.now() - key < 2000),
    ])
    setNotification(null)
  }, [notification, notifications])

  useEffect(() => {
    subscribe(setNotification)

    setPad(padding => {
      if (!ref.current) return
      ref.current.style['padding-bottom'] = padding || 'initial'
    })

    return () => {
      unsubscribe(setNotification)
      setPad()
    }
  }, [setNotifications])

  return (
    <div className={styles.stack} ref={ref}>
      {notifications.map(({ msg, key }) => (
        <Toast msg={msg} key={key} />
      ))}
    </div>
  )
}
