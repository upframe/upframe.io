import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styles from './login.module.scss'
import { Labeled, Input, Button, Card, Page } from '../../components'
import { useCtx, useHistory, useMe } from '../../utils/Hooks'
import { mutations, useMutation } from '../../gql'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setCurrentUser } = useCtx()
  const history = useHistory()
  const me = useMe()

  const [signIn] = useMutation(mutations.SIGN_IN, {
    onCompleted: ({ signIn: user }) => {
      if (!user) return
      setCurrentUser(user.id)
      localStorage.setItem('loggedin', true)
      history.push('/')
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    signIn({ variables: { email, password } })
  }

  if (me) return <Redirect to="/" />
  return (
    <Page form title="Login" onSubmit={handleSubmit} className={styles.login}>
      <Labeled
        label="Email"
        action={
          <Input
            type="email"
            autoComplete="username"
            value={email}
            onChange={setEmail}
          />
        }
      />
      <Labeled
        label="Password"
        action={
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
        }
      />
      <Button accent type="submit">
        Login
      </Button>
    </Page>
  )
}
