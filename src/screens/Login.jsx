import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import {
  Labeled,
  Input,
  Button,
  Page,
  GoogleSignin,
  Divider,
} from '../components'
import { useHistory, useMe, useSignIn } from '../utils/hooks'
import { gql, fragments, mutations, useMutation } from '../gql'
import styled from 'styled-components'
import { hasError } from '../api'
import { notify } from '../notification'

const SIGNIN_GOOGLE = gql`
  mutation SigninWithGoogle($code: ID!, $redirect: String!) {
    signInGoogle(code: $code, redirect: $redirect) {
      ...PersonBase
      ... on Mentor {
        calendarConnected
      }
    }
  }
  ${fragments.person.base}
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const { me } = useMe()
  const afterLogin = useSignIn()

  const [signInGoogle] = useMutation(SIGNIN_GOOGLE, {
    onError(err) {
      if (hasError(err, 'INVALID_GRANT'))
        notify('Invalid grant. Try logging in again')
      history.push(window.location.pathname)
    },
    onCompleted({ signInGoogle: user }) {
      if (!user) return
      afterLogin(user)
    },
  })

  const [signIn] = useMutation(mutations.SIGN_IN, {
    onCompleted: ({ signIn: user }) => {
      if (!user) return
      afterLogin(user)
    },
  })

  const code = new URLSearchParams(window.location.search).get('code')

  useEffect(() => {
    if (!code || !signInGoogle) return
    signInGoogle({
      variables: {
        code,
        redirect: window.location.origin + window.location.pathname,
      },
    })
  }, [code, signInGoogle])

  function handleSubmit(e) {
    e.preventDefault()
    signIn({ variables: { email, password } })
  }

  if (me) return <Redirect to="/" />
  return (
    <Page form title="Login" onSubmit={handleSubmit}>
      <GoogleSignin type="button" />
      <Divider />
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
