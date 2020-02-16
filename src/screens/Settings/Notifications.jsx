import React, { useState, useEffect } from 'react'
import { Title, Text, Checkbox } from 'components'
import Item from './Item'
import IntervalSelect from './IntervalSelect'
import styles from './notifications.module.scss'
import ChangeBanner from './ChangeBanner'
import Api from 'utils/Api'
import { useCtx } from 'utils/Hooks'
import { notify } from '../../notification'

export default function Notifications() {
  const ctx = useCtx()
  const [email, setEmail] = useState(null)
  const [avail, setAvail] = useState(null)

  useEffect(() => {
    if (email !== null || !ctx.user) return
    setAvail(ctx.user.availabilityReminder)
    setEmail(ctx.user.emailNotifications)
  }, [ctx, email])

  const diff = !ctx.user
    ? {}
    : {
        ...(email !== ctx.user.emailNotifications && {
          emailNotifications: email,
        }),
        ...(avail !== ctx.user.availabilityReminder && {
          availabilityReminder: avail,
        }),
      }

  function saveChanges() {
    Api.updateUserInfo(diff)
      .then(({ ok }) => {
        if (ok !== 1) throw Error()
        ctx.saveUserInfo({ ...ctx.user, ...diff })
      })
      .catch(() => notify('something went wrong'))
  }

  return (
    <div className={styles.notifications}>
      <Title s2>Email Notifications</Title>
      <Text>Get emails to find out about what’s new on Upframe.</Text>
      <Item
        label="⚡️ Remind me to add free slots"
        custom={<IntervalSelect selected={avail} onChange={setAvail} />}
      >
        We’ll remind you to add new free slots to your calendar, so people can
        schedule calls with you in a zap.
      </Item>
      <Title s2>Emails from Upframe</Title>
      <div className={styles.emailCheck}>
        <Checkbox checked={email} onChange={setEmail} />
        <Text>Updates about our new product features and releases.</Text>
      </div>
      {!!Object.entries(diff).length && <ChangeBanner onSave={saveChanges} />}
    </div>
  )
}
