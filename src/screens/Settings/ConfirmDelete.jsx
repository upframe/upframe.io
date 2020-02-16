import React, { useState } from 'react'
import { Title, Text, Input, Button } from 'components'
import Api from 'utils/Api'
import { useCtx } from 'utils/Hooks'
import styles from './confirmDelete.module.scss'
import { notify } from '../../notification'

export default function ConfirmDelete({ onCancel }) {
  const ctx = useCtx()
  const [password, setPassword] = useState('')

  function deleteAccount() {
    Api.deleteAccount(password)
      .then(res => {
        if (res.status !== 200) throw Error('UNAUTHORIZED')
        notify('account deleted successfully')
        setTimeout(() => window.open('/', '_self'), 2000)
      })
      .catch(err => {
        notify(
          err.message === 'UNAUTHORIZED'
            ? 'wrong password'
            : "couldn't delete account"
        )
        onCancel()
      })
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form
        className={styles.confirmBox}
        onClick={e => e.stopPropagation()}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <Title s4>Are you sure?</Title>
        <Text strong>
          This action <Text bold>cannot</Text> be undone. Your account{' '}
          <Text underlined>{ctx.user.email}</Text> will be permanently deleted.
        </Text>
        <Text strong>Please enter your password to confirm.</Text>
        <Input type="password" onChange={setPassword} value={password} />
        <div className={styles.btWrap}>
          <Button onClick={onCancel} type="cancel">
            Cancel
          </Button>
          <Button onClick={deleteAccount} warn type="submit">
            Delete Account
          </Button>
        </div>
      </form>
    </div>
  )
}
