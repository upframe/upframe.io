import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Labeled, Input, Button, Page } from '../components'
import { useCtx, useHistory, useMe } from '../utils/hooks'
import { mutations, useMutation } from '../gql'
import styled from 'styled-components'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setCurrentUser } = useCtx()
  const history = useHistory()
  const { me } = useMe()

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
    <Page form title="Login" onSubmit={handleSubmit}>
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
      <S.Forgot>
        <Link to="/reset/password">Forgot Password?</Link>
      </S.Forgot>
      <Button accent type="submit">
        Login
      </Button>
    </Page>
  )
}

const S = {
  Forgot: styled.div`
    position: absolute;
    transform: translateY(-6.1rem);
    right: 3rem;

    a {
      font-size: 0.7rem;
    }
  `,
}
