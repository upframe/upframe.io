import React, { useState } from 'react'
import { Title, Text, Input, Button } from 'components'
import { useDispatch, useHistory, useMe } from 'utils/hooks'
import styles from './confirmDelete.module.scss'
import { notify } from 'notification'
import { mutations, useMutation } from 'gql'

export default function ConfirmDelete({ onCancel }) {
  const dispatch = useDispatch()
  const { me } = useMe()
  const [handle, setHandle] = useState('')
  const history = useHistory()

  const [deleteAccount] = useMutation(mutations.DELETE_ACCOUNT, {
    variables: {
      handle,
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
        dispatch('SET_ME_ID', { value: null })
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
          <Text underlined>{me.email}</Text> will be permanently deleted.
        </Text>
        <Text strong>Please enter your username to confirm.</Text>
        <Input autoComplete="off" onChange={setHandle} value={handle} />
        <div className={styles.btWrap}>
          <Button onClick={onCancel} type="cancel">
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            warn
            type="submit"
            disabled={me.handle !== handle}
          >
            Delete Account
          </Button>
        </div>
      </form>
    </div>
  )
}
