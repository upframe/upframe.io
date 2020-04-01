import React, { useState, useEffect } from 'react'
import { Title, Text, Checkbox } from 'components'
import GoogleSync from './GoogleSync'
import { classes } from 'utils/css'
import styles from './calendarList.module.scss'

export default function CalendarList({ onChange, user, loading = [] }) {
  const [selection, setSelection] = useState([])

  useEffect(() => {
    let saved = localStorage.getItem('calendars')
    saved = saved ? JSON.parse(saved) : []
    if (saved.length) {
      setSelection(saved)
      onChange(saved)
    }
  }, [onChange])

  function toggleCalendar(id, v) {
    if (v === undefined) v = !selection.includes(id)
    const select = v ? [...selection, id] : selection.filter(n => n !== id)
    localStorage.setItem('calendars', JSON.stringify(select))
    setSelection(select)
    onChange(select)
  }

  return (
    <div className={styles.wrap}>
      <div
        className={classes(styles.calendarList, {
          [styles.synced]: user.calendarConnected,
        })}
      >
        {user.calendarConnected && (
          <>
            <Title s3>Calendars</Title>
            <div className={styles.list}>
              {(user.calendars || []).map(({ id, name, color }, i) => {
                return (
                  <div className={styles.calendarToggle} key={id}>
                    <Checkbox
                      onChange={v => toggleCalendar(id, v)}
                      checked={selection.includes(id)}
                      color={color}
                      loading={loading.includes(id)}
                    />
                    <Text small strong>
                      {name}
                    </Text>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {!user.calendarConnected && (
          <>
            <Title s3>Connect your Google&nbsp;Calendar</Title>
            <Text strong small mark>
              Scheduled events are added instantly to your calendar.
            </Text>
            <Text strong small>
              Check your availability before adding free slots.
            </Text>
            <GoogleSync />
          </>
        )}
      </div>
    </div>
  )
}
