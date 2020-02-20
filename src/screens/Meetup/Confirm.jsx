import React, { useEffect } from 'react'
import { mutations, useMutation } from '../../gql'
import { Spinner } from '../../components'
import styles from './meetup.module.scss'

export default function MeetupConfirm({ match }) {
  const [
    accept,
    { data: { acceptMeetup: meetup } = {}, loading },
  ] = useMutation(mutations.ACCEPT_MEETUP, {
    variables: { meetupId: match.params.meetupid },
  })

  useEffect(() => {
    accept()
  }, [accept])

  if (loading) return <Spinner centered />
  if (!meetup) return null
  return (
    <div className={styles.status}>
      <p>
        Accepted meeting with {meetup.mentee.name} on{' '}
        {new Date(meetup.start).toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}{' '}
        at{' '}
        {new Date(meetup.start).toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}
        .
      </p>
      <p>
        You can join the call <a href={meetup.location}>here</a>.
      </p>
    </div>
  )
}
