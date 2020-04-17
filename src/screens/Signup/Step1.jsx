import React, { useState } from 'react'
import { Page, Labeled, Input, Button } from '../../components'

export default function Step1({ info: { email } }) {
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(false)

  return (
    <Page form title="Signup">
      <Labeled
        label="Email"
        action={<Input type="email" value={email} disabled />}
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
              setValid(target.validity.valid)
            }}
            changeTarget
            required
          />
        }
      />
      <Button accent type="submit" disabled={!valid}>
        next
      </Button>
    </Page>
  )
}
