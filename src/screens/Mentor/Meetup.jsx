import React from 'react'
import styles from './profile.module.scss'
import { Card, Title, Button } from '../../components'
import Slot from './Slot'
import { useMe } from 'utils/hooks'

const phUrl = 'https://www.producthunt.com/upcoming/upframe'

export default function Meetup({ mentor, onSlot, onMsg }) {
  const { me } = useMe()

  return (
    <Card className={styles.meetup}>
      <Title size={3}>Send me a message or schedule a meetup</Title>
      <div className={styles.slots}>
        {(mentor.slots || [])
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .map(({ start }) => (
            <Slot
              key={start}
              start={start}
              {...(me
                ? {
                    onClick: v =>
                      onSlot(mentor.slots.find(({ start }) => start === v).id),
                  }
                : { linkTo: phUrl })}
            />
          ))}
        <Button filled {...(me ? { onClick: onMsg } : { linkTo: phUrl })}>
          Message
        </Button>
      </div>
    </Card>
  )
}
