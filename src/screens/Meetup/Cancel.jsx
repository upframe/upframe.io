import React, { useEffect } from 'react'
import { mutations, useMutation } from '../../gql'
import { Spinner, Text } from '../../components'
import styles from './meetup.module.scss'
import { notify } from '../../notification'

export default function MeetupCancel({ match }) {
  const [cancel, { loading, data }] = useMutation(mutations.CANCEL_MEETING, {
    variables: { meetupId: match.params.meetupid },
    onError({ graphQLErrors }) {
      graphQLErrors
        .filter(({ extensions }) => extensions.code !== 'BAD_USER_INPUT')
        .forEach(notify)
    },
  })

  useEffect(() => {
    cancel()
  }, [cancel])

  if (loading) return <Spinner centered />
  if (!data) return null
  return (
    <div className={styles.status}>
      <Text>Meetup successfully cancelled.</Text>
    </div>
  )
}
