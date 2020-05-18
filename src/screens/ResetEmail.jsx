import React, { useState, useEffect } from 'react'
import { Page, Title, Input, Button, Text, Spinner } from '../components'
import { mutations, useMutation } from 'gql'
import { notify } from 'notification'
import { useHistory } from 'utils/hooks'

export default function ResetEmail({ match }) {
  const [email, setEmail] = useState()
  const token = match?.params?.token
  const history = useHistory()

  const [requestChange] = useMutation(mutations.REQUEST_EMAIL_CHANGE, {
    variables: { email },
    onCompleted() {
      notify(`we sent an email with the confirmation link to ${email}`)
    },
  })

  const [changeEmail, { loading }] = useMutation(mutations.CHANGE_EMAIL, {
    variables: { token },
    onError() {
      history.push('/reset/email')
    },
    onCompleted({ changeEmail: user }) {
      notify('email successfully changed')
      history.push(user ? '/settings' : '/login')
    },
  })

  useEffect(() => {
    if (!token || !changeEmail) return
    changeEmail()
  }, [token, changeEmail])

  return (
    <Page form title="Change Email" onSubmit={requestChange}>
      <Title s3>Change Email</Title>
      {token ? (
        <>{loading && <Spinner />}</>
      ) : (
        <>
          <Text>
            Enter your new email address and we will send you an email with a
            confirmation link.
          </Text>
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="off"
            required
            placeholder="new email address"
          />
          <Button type="submit" accent>
            Send confirmation link
          </Button>
        </>
      )}
    </Page>
  )
}
