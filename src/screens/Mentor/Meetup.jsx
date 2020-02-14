import React from 'react'
import styles from './profile.module.scss'
import { Card, Title, Text, Button } from '../../components'
import Slot from './Slot'

export default function Meetup({ mentor, onSlot, onMsg }) {
  return (
    <Card className={styles.meetup}>
      <Title s3>Book a meetup with me</Title>
      <Text>
        Upframe one-on-one mentoring sessions come in two flavours, video chats
        or in-person meetings. You can also send me a direct message.
      </Text>
      <div className={styles.slots}>
        {(mentor.slots || []).map(({ start }) => (
          <Slot
            key={start}
            start={start}
            onClick={v =>
              onSlot(mentor.slots.find(({ start }) => start === v).sid)
            }
          />
        ))}
        <Button filled onClick={onMsg}>
          Message
        </Button>
      </div>
    </Card>
  )
}
