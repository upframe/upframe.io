import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useMe, useSignIn } from 'utils/hooks'
import { gql, fragments, useMutation } from 'gql'
import styled from 'styled-components'
import { notify } from 'notification'
import type * as T from 'gql/types'
import {
  Labeled,
  Input,
  Button,
  Page,
  GoogleSignin,
  Divider,
  Spinner,
} from '../components'

const SIGN_IN = gql`
  mutation SignIn($password: PasswordLoginInput, $google: GoogleLoginInput) {
    signIn(passwordInput: $password, googleInput: $google) {
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
  const { me } = useMe()
  const afterLogin = useSignIn()
  const [authCode, setAuthCode] = useState<string>()
  const redirect = window.location.origin + window.location.pathname

  const [signIn, { loading, data }] = useMutation<T.SignIn, T.SignInVariables>(
    SIGN_IN,
    {
      onError({ message }) {
        notify(message)
      },
      onCompleted({ signIn: user }) {
        if (!user) return
        afterLogin(user)
      },
    }
  )

  function handleSubmit() {
    signIn({ variables: { password: { email, password } } })
  }

  useEffect(() => {
    if (!authCode || !signIn) return
    signIn({ variables: { google: { code: authCode, redirect } } })
  }, [authCode, redirect, signIn])

  if (me) return <Redirect to="/" />
  if (loading) return <Spinner centered />
  return (
    <Page form title="Login" onSubmit={handleSubmit}>
      <GoogleSignin
        type="button"
        onCode={setAuthCode}
        redirect={redirect}
        disabled={loading || !!data?.signIn}
      />
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
