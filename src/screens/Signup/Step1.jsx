import React, { useState, useEffect } from 'react'
import { Page, Labeled, Input, Button, Divider } from '../../components'
import Google from './Google'
import styled from 'styled-components'
import { gql, useMutation } from '../../gql'

const SIGNUP_GOOGLE = gql`
  mutation SignupWithGoogle($token: ID!, $code: ID!) {
    signUpGoogle(token: $token, code: $code)
  }
`

export default function Step1({ info, token }) {
  const [email, setEmail] = useState(info.email)
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState({ email: true, password: false })
  const [signUpGoogle] = useMutation(SIGNUP_GOOGLE)

  useEffect(() => {
    if (!signUpGoogle || !token) return
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) return
    signUpGoogle({ variables: { code, token } })
  }, [signUpGoogle, token])

  return (
    <Page title="Signup" style={S.Step1} defaultStyle>
      <Google type="button" state={token} />
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
