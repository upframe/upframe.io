import React from 'react'
import { Title, Text, Checkbox, Spinner } from 'components'
import Item from './Item'
import IntervalSelect from './IntervalSelect'
import styles from './notifications.module.scss'
import { useCtx } from 'utils/Hooks'
import { queries, mutations, useQuery, useMutation } from '../../gql'

export default function Notifications() {
  const { currentUser } = useCtx()

  const { data: { mentor: user = {} } = {} } = useQuery(
    queries.SETTINGS_NOTIFICATIONS,
    {
      variables: { keycode: currentUser },
    }
  )

  const [updatePrefs] = useMutation(mutations.UPDATE_NOTIICATION_PREFERENCES)

  if (!user.notificationPrefs) return <Spinner centered />
  return (
    <div className={styles.notifications}>
      <Title s2>Email Notifications</Title>
      <Text>Get emails to find out about what’s new on Upframe.</Text>
      <Item
        label="⚡️ Remind me to add free slots"
        custom={
          <IntervalSelect
            selected={user.notificationPrefs.slotReminder}
            onChange={v =>
              updatePrefs({
                variables: { diff: { slotReminder: v.toUpperCase() } },
              })
            }
          />
        }
      >
        We’ll remind you to add new free slots to your calendar, so people can
        schedule calls with you in a zap.
      </Item>
      <Title s2>Emails from Upframe</Title>
      <div className={styles.emailCheck}>
        <Checkbox
          checked={user.notificationPrefs.receiveEmails}
          onChange={receiveEmails =>
            updatePrefs({
              variables: { diff: { receiveEmails } },
            })
          }
        />
        <Text>Updates about our new product features and releases.</Text>
      </div>
    </div>
  )
}
