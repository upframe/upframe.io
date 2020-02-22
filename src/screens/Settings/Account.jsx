import React, { useState } from 'react'
import { Text, Title, Checkbox } from 'components'
import Item from './Item'
import ConfirmDelete from './ConfirmDelete'
import styles from './account.module.scss'
import { useCtx } from '../../utils/Hooks'
import { queries, mutations, useQuery, useMutation } from '../../gql'

export default function Account() {
  const { currentUser } = useCtx()
  const [deleteRequested, setDeleteRequested] = useState(false)

  const { data: { mentor: user = {} } = {} } = useQuery(
    queries.SETTINGS_ACCOUNT,
    {
      variables: { id: currentUser, skip: !currentUser },
    }
  )

  const [setVisibility] = useMutation(mutations.SET_PROFILE_VISIBILITY)
  const [changeEmail] = useMutation(mutations.REQUEST_EMAIL_CHANGE)
  const [changePassword] = useMutation(mutations.REQUEST_PASSWORD_CHANGE)

  return (
    <div className={styles.account}>
      <Title s2>Account</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item label="Your email" button="Change Email" onChange={changeEmail}>
        <Text underlined>{user.email}</Text> is your current email address
        connected to your Upframe account.
      </Item>
      <Item label="Password" button="Change Password" onChange={changePassword}>
        You’ll receive an email in your inbox so you can reset your password.
      </Item>
      <Title s2>Your Data</Title>
      <Text>
        At Upframe, we care about your privacy and are actively working in order
        to give you back control and ownership of your data. Just like how it
        should be.
      </Text>
      <Item
        label="Delete Account"
        button="Delete Account"
        onChange={() => setDeleteRequested(true)}
      >
        Your account will be removed from our database. Your username and public
        profile will no longer be available at upframe.io. This action is
        irreversible, please proceed with caution.
      </Item>
      <Title s2>Privacy</Title>
      <div className={styles.privacyCheck}>
        <Checkbox
          checked={user.visibility === 'UNLISTED'}
          onChange={v =>
            setVisibility({
              variables: { visibility: v ? 'UNLISTED' : 'LISTED' },
            })
          }
        />
        <Text>Hide my profile from the homepage.</Text>
      </div>
      {deleteRequested && (
        <ConfirmDelete onCancel={() => setDeleteRequested(false)} />
      )}
    </div>
  )
}
