import React from 'react'
import { Title, Text, Checkbox } from 'components'
import Item from './Item'
import IntervalSelect from './IntervalSelect'
import styles from './notifications.module.scss'

export default function Notifications() {
  return (
    <div className={styles.notifications}>
      <Title s2>Email Notifications</Title>
      <Text>Get emails to find out about what’s new on Upframe.</Text>
      <Item label="⚡️ Availability Reminder" custom={<IntervalSelect />}>
        We’ll remind you to add new free slots to your calendar, so people can
        schedule calls with you in a zap.
      </Item>
      <Title s2>Emails from Upframe</Title>
      <div className={styles.emailCheck}>
        <Checkbox />
        <Text>Updates about our new product features and releases.</Text>
      </div>
    </div>
  )
}
