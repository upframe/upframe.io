import React, { useState } from 'react'
import { Text, Title, Checkbox } from 'components'
import Item from './Item'
import ConfirmDelete from './ConfirmDelete'
import styles from './account.module.scss'
import { useMe } from '../../utils/Hooks'
import { mutations, useMutation } from '../../gql'

export default function Account() {
  const { me } = useMe()
  const [deleteRequested, setDeleteRequested] = useState(false)

  const [setVisibility, { loading }] = useMutation(
    mutations.SET_PROFILE_VISIBILITY
  )

  return (
    <div className={styles.account}>
      <Title s2>Account</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item label="Your email" button="Change Email" linkTo="/reset/email">
        <Text underlined>{me.email}</Text> is your current email address
        connected to your Upframe account.
      </Item>
      <Item label="Password" button="Change Password" linkTo="/reset/password">
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
      {me.role && me.role !== 'USER' && (
        <>
          <Title s2>Privacy</Title>
          <div className={styles.privacyCheck}>
            <Checkbox
              checked={me.visibility === 'UNLISTED'}
              onChange={v =>
                setVisibility({
                  variables: { visibility: v ? 'UNLISTED' : 'LISTED' },
                })
              }
              loading={loading}
            />
            <Text>Hide my profile from the homepage.</Text>
          </div>
        </>
      )}
      {deleteRequested && (
        <ConfirmDelete onCancel={() => setDeleteRequested(false)} />
      )}
    </div>
  )
}
