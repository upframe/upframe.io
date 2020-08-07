import React, { useState } from 'react'
import { Title, Text, Checkbox, Spinner } from 'components'
import styles from './notifications.module.scss'
import { useMe } from 'utils/hooks'
import { queries, mutations, useQuery, useMutation } from 'gql'

export default function Notifications() {
  const { me } = useMe()
  const [mail, setMail] = useState(false)
  const [msg, setMsg] = useState(false)

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

  if (!user.notificationPrefs) return <Spinner centered />
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
