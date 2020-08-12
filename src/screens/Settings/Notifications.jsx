import React, { useState, useEffect } from 'react'
import { Title, Text, Checkbox, Spinner } from 'components'
import styles from './notifications.module.scss'
import { useMe, useSignOut, useHistory } from 'utils/hooks'
import { gql, queries, mutations, useQuery, useMutation, fragments } from 'gql'
import { notify } from 'notification'

const UNSUBSCRIBE = gql`
  mutation UnsubscribeEmailNotifications($token: ID!) {
    unsubscribeEmailNotifications(token: $token) {
      ...NotificationSettings
    }
  }
  ${fragments.person.notificationSettings}
`

export default function Notifications() {
  const { me } = useMe()
  const [mail, setMail] = useState(false)
  const [msg, setMsg] = useState(false)
  const unsubscribeToken = new URLSearchParams(window.location.search).get(
    'unsubscribe'
  )
  const history = useHistory()
  const signOut = useSignOut()

  const { data: { user = {} } = {} } = useQuery(
    queries.SETTINGS_NOTIFICATIONS,
    {
      variables: { id: me.id, skip: !me },
    }
  )

  const [updatePrefs, { loading }] = useMutation(
    mutations.UPDATE_NOTIICATION_PREFERENCES,
    {
      onCompleted() {
        setMail(false)
      },
    }
  )

  const [unsubscribe] = useMutation(UNSUBSCRIBE, {
    variables: { token: unsubscribeToken },
    onError() {
      signOut({ mutate: true, query: window.location.search })
    },
    onCompleted() {
      history.push(
        window.location.pathname +
          window.location.search
            .replace(/[?&]unsubscribe=.+(?=&|$)/, '')
            .replace(/^&/, '?')
      )
      notify('successfully unsubscribed from email notifications')
    },
  })

  useEffect(() => {
    if (!unsubscribeToken) return
    unsubscribe()
  }, [unsubscribeToken, unsubscribe])

  if (!user.notificationPrefs || unsubscribeToken) return <Spinner centered />
  return (
    <div className={styles.notifications}>
      <Title size={2}>Conversations</Title>
      <Title size={2}>Email Notifications</Title>
      <div className={styles.emailCheck}>
        <Checkbox
          checked={user.notificationPrefs.msgEmails}
          onChange={msgEmails => {
            setMsg(true)
            updatePrefs({
              variables: { diff: { msgEmails } },
            })
          }}
          loading={msg && loading}
        />
        <Text>I want to receive email notifications for new messages.</Text>
      </div>
      <Title size={2}>Emails from Upframe</Title>
      <div className={styles.emailCheck}>
        <Checkbox
          checked={user.notificationPrefs.receiveEmails}
          onChange={receiveEmails => {
            setMail(true)
            updatePrefs({
              variables: { diff: { receiveEmails } },
            })
          }}
          loading={mail && loading}
        />
        <Text>Updates about our new product features and releases.</Text>
      </div>
    </div>
  )
}
