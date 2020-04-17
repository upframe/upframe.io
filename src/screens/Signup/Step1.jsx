import React, { useState } from 'react'
import { Page, Labeled, Input, Button, Divider } from '../../components'
import Google from './Google'
import styled from 'styled-components'

export default function Step1({ info }) {
  const [email, setEmail] = useState(info.email)
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState({ email: true, password: false })

  return (
    <Page form title="Signup" style={S.Step1} defaultStyle>
      <Google />
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
