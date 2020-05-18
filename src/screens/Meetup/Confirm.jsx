import React, { useEffect } from 'react'
import { mutations, useMutation } from 'gql'
import { Spinner, Text } from '../../components'
import styles from './meetup.module.scss'
import { notify } from 'notification'

export default function MeetupConfirm({ match }) {
  const [
    accept,
    { data: { acceptMeetup: meetup } = {}, loading },
  ] = useMutation(mutations.ACCEPT_MEETUP, {
    variables: { meetupId: match.params.meetupid },
    onError({ graphQLErrors }) {
      graphQLErrors
        .filter(({ extensions }) => extensions.code !== 'BAD_USER_INPUT')
        .forEach(notify)
    },
  })

  useEffect(() => {
    accept()
  }, [accept])

  if (loading) return <Spinner centered />
  if (!meetup) return null
  return (
    <div className={styles.status}>
      <Text>
        Accepted meetup with {meetup.mentee.name} on{' '}
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
      </Text>
      <Text>
        You can join the call at <a href={meetup.location}>this url</a>.
      </Text>
    </div>
  )
}
