import React, { useContext } from 'react'
import { useToast } from 'utils/Hooks'
import { Text, Title } from 'components'
import Item from './Item'
import AppContext from 'components/AppContext'
import Api from 'utils/Api'
import styles from './account.module.scss'

export default function Account() {
  const ctx = useContext(AppContext)
  const showToast = useToast()

  const change = request => () =>
    request
      .bind(Api)(ctx.user.email)
      .then(({ ok }) => {
        if (ok !== 1) throw Error()
        showToast('An email has been sent to you')
      })
      .catch(() =>
        showToast('Could not complete request. Please contact support.')
      )

  return (
    <div className={styles.account}>
      <Title s2>Account</Title>
      <Text>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>
      <Item
        label="Your email"
        button="Change Email"
        onChange={change(Api.changeEmail)}
      >
        <Text underlined>{ctx.user.email}</Text> is your current email address
        connected to your Upframe account.
      </Item>
      <Item
        label="Password"
        button="Change Password"
        onChange={change(Api.resetPassword)}
      >
        You’ll receive an email in your inbox so you can reset your password.
      </Item>
      <Title s2>Your Data</Title>
      <Text>
        At Upframe, we care about your privacy and are actively working in order
        to give you back control and ownership of your data. Just like how it
        should be.
      </Text>
      <Item label="Delete Account" button="Delete Account">
        Your account will be removed from our database. Your username and public
        profile will no longer be available at upframe.io. This action is
        irreversible, please proceed with caution.
      </Item>
    </div>
  )
}
