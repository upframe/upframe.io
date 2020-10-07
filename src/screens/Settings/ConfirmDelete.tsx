import React, { useState } from 'react'
import { Modal, Text, Input, Button } from 'components'
import { useMe, useSignOut } from 'utils/hooks'
import { notify } from 'notification'
import { mutations, useMutation } from 'gql'

export default function ConfirmDelete({ onCancel }) {
  const { me } = useMe()
  const [handle, setHandle] = useState('')
  const signOut = useSignOut()

  const [deleteAccount] = useMutation(mutations.DELETE_ACCOUNT, {
    variables: {
      handle,
    },
    onError({ graphQLErrors }) {
      graphQLErrors.forEach(err => {
        if (err?.extensions?.code !== 'FORBIDDEN') throw err
        notify(err.message)
      })
    },
    onCompleted() {
      notify('account deleted')
      setTimeout(signOut, 1500)
    },
  })

  return (
    <Modal
      title="Are you sure?"
      onClose={onCancel}
      actions={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => deleteAccount()}
            warn
            type="submit"
            disabled={me?.handle !== handle}
          >
            Delete Account
          </Button>
        </>
      }
    >
      <Text strong>
        This action <Text bold>cannot</Text> be undone. Your account{' '}
        <Text underlined>{me?.email}</Text> will be permanently deleted.
      </Text>
      <Text strong>Please enter your username to confirm.</Text>
      <Input
        autoComplete="off"
        onChange={v => setHandle(v as string)}
        value={handle}
      />
    </Modal>
  )
}
