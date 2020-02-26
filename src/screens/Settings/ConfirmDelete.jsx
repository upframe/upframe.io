import React, { useState } from 'react'
import { Title, Text, Input, Button } from 'components'
import { useCtx, useHistory } from 'utils/Hooks'
import styles from './confirmDelete.module.scss'
import { notify } from '../../notification'
import { mutations, useMutation } from '../../gql'

export default function ConfirmDelete({ onCancel }) {
  const { user, setCurrentUser } = useCtx()
  const [password, setPassword] = useState('')
  const history = useHistory()

  const [deleteAccount] = useMutation(mutations.DELETE_ACCOUNT, {
    variables: {
      password,
    },
    onError({ graphQLErrors }) {
      graphQLErrors.forEach(err => {
        if (err.extensions.code !== 'FORBIDDEN') throw err
        notify(err.message)
      })
    },
    onCompleted() {
      notify('account deleted')
      setTimeout(() => {
        setCurrentUser(null)
        history.push('/')
      }, 2000)
    },
  })

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
          <Text underlined>{user.email}</Text> will be permanently deleted.
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
