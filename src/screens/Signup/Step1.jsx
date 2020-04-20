import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {
  Page,
  Labeled,
  Input,
  Button,
  Divider,
  GoogleSignin,
} from '../../components'
import styled from 'styled-components'
import { gql, useMutation } from '../../gql'
import { hasError } from '../../api'
import { notify } from '../../notification'

const SIGNUP_GOOGLE = gql`
  mutation SignupWithGoogle($token: ID!, $code: ID!, $redirect: String!) {
    signUpGoogle(token: $token, code: $code, redirect: $redirect) {
      id
      email
      role
      authComplete
      name
    }
  }
`

export default function Step1({ info, token }) {
  const [email, setEmail] = useState(info.email)
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState({ email: true, password: false })

  const [signUpGoogle, { error }] = useMutation(SIGNUP_GOOGLE, {
    onError(err) {
      if (!hasError(err, 'INVALID_GRANT')) return
      notify('Invalid grant. Try connecting Google again')
    },
  })
  const redirect = `${window.location.origin}/signup`

  useEffect(() => {
    if (!signUpGoogle || !token || !redirect) return
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) return
    signUpGoogle({ variables: { code, token, redirect } })
  }, [signUpGoogle, token, redirect])

  if (error && hasError(error, 'INVALID_GRANT'))
    return <Redirect to={window.location.pathname} />
  return (
    <Page title="Signup" style={S.Step1} defaultStyle>
      <GoogleSignin
        verb="Sign up"
        type="button"
        state={token}
        redirect={redirect}
      />
      <Divider />
      <Labeled
        label="Email"
        action={
          <Input
            type="email"
            value={email}
            autoComplete="email"
            onChange={target => {
              setEmail(target.value)
              setValid({ ...valid, email: target.validity.valid })
            }}
            changeTarget
          />
        }
      />
      <Labeled
        label="Password"
        action={
          <Input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={target => {
              setPassword(target.value)
              setValid({ ...valid, password: target.validity.valid })
            }}
            changeTarget
            required
          />
        }
      />
      <Button accent type="submit" disabled={!valid.email || !valid.password}>
        next
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
