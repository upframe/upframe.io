import React, { useState } from 'react'
import { Input, Title, Button, Spinner, Page, Text } from '../components'
import { useMe, useHistory, useSignIn } from 'utils/hooks'
import { queries, mutations, useQuery, useMutation } from 'gql'
import { notify } from 'notification'

export default function ResetPassword({ match }) {
  const [password, setPassword] = useState('')
  const [control, setControl] = useState()
  const [email, setEmail] = useState()
  const { me, loading } = useMe()
  const history = useHistory()
  const token = match?.params?.token
  const signIn = useSignIn()

  const { loading: tokenLoading } = useQuery(queries.VERIFY_TOKEN, {
    variables: { token },
    skip: typeof token !== 'string',
    onCompleted({ isTokenValid }) {
      if (isTokenValid) return
      notify('invalid token')
      history.push('/reset/password')
    },
  })
  const [changePassword] = useMutation(mutations.CHANGE_PASSWORD, {
    variables: { password, token },
    onCompleted({ changePassword: user }) {
      signIn(user)
    },
  })
  const [requestReset] = useMutation(mutations.REQUEST_PASSWORD_CHANGE, {
    variables: { email },
    onCompleted() {
      notify('we sent you an email with the reset link')
    },
  })

  if (loading || tokenLoading) return <Spinner centered />
  if (!me && !token)
    return (
      <Page
        form
        title="Reset Password"
        onSubmit={e => {
          e.preventDefault()
          requestReset()
        }}
      >
        <Title s3>Reset your Password</Title>
        <Text>
          Enter your account's email address and we will send you a password
          reset link.
        </Text>
        <Input
          type="email"
          autoComplete="username"
          value={email}
          onChange={setEmail}
          required
        />
        <Button type="submit" accent>
          Send password reset email
        </Button>
      </Page>
    )
  return (
    <Page
      form
      title="Change Password"
      onSubmit={e => {
        e.preventDefault()
        if (password.length >= 8 && password === control) changePassword()
      }}
    >
      <Title s3>Reset Password</Title>
      <Input
        type="email"
        value={me?.email}
        autoComplete="off"
        disabled
        hidden
      />
      <Input
        type="password"
        autoComplete="new-password"
        data-lpignore="true"
        value={password}
        onChange={setPassword}
        placeholder="new password"
        required
      />
      <Input
        type="password"
        autoComplete="off"
        data-lpignore="true"
        value={control || ''}
        onChange={setControl}
        placeholder="confirm password"
        required
      />
      <Button
        accent
        type="submit"
        disabled={password.length < 8 || password !== control}
      >
        change password
      </Button>
    </Page>
  )
}
