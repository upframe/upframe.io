import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useSignIn } from 'utils/hooks'
import { useMutation } from 'gql'
import * as gql from './gql'
import type * as T from 'gql/types'
import {
  Page,
  Labeled,
  Input,
  Button,
  Divider,
  GoogleSignin,
} from '../../components'

export default function Step1({ info, token }) {
  const [email, setEmail] = useState(info.email ?? '')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState({ email: true, password: false })
  const history = useHistory()
  const [code, setCode] = useState<string>()
  const signIn = useSignIn()

  const [signUp, { loading }] = useMutation<T.SignUp, T.SignUpVariables>(
    gql.SIGNUP,
    {
      onCompleted({ signUp }) {
        if (signUp.__typename !== 'SignUpInfo') return signIn(signUp)
        history.push(`/signup/${(signUp as any).id}`)
      },
    }
  )

  const redirect = `${window.location.origin}/signup`

  useEffect(() => {
    if (!code || !token) return
    signUp({ variables: { token, googleInput: { code, redirect } } })
  }, [code, redirect, token, signUp])

  function submit() {
    signUp({ variables: { token, passwordInput: { email, password } } })
  }

  return (
    <Page
      title="Signup"
      style={S.Step1}
      defaultStyle
      form
      onSubmit={submit}
      loading={loading}
    >
      <GoogleSignin
        verb="Sign up"
        type="button"
        redirect={redirect}
        state={token}
        onCode={setCode}
      />
      <Divider />
      <Labeled
        label="Email"
        action={
          <Input
            type="email"
            value={email}
            autoComplete="email"
            onChange={
              ((target: HTMLInputElement) => {
                setEmail(target.value)
                setValid({ ...valid, email: target.validity.valid })
              }) as any
            }
            changeTarget
          />
        }
      />
      <Labeled
        label="New Password"
        action={
          <Input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={
              ((target: HTMLInputElement) => {
                setPassword(target.value)
                setValid({ ...valid, password: target.validity.valid })
              }) as any
            }
            changeTarget
            required
          />
        }
      />
      <Button accent type="submit" disabled={!valid.email || !valid.password}>
        next
      </Button>
      <Button text linkTo="/login">
        Already have an account? Sign in instead.
      </Button>
    </Page>
  )
}

const S = {
  Step1: styled(Page.Form)`
    hr {
      margin: 2rem 0;
    }
  `,
}
