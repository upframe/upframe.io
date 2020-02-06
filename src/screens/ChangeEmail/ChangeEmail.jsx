import React, { useState } from 'react'
import styles from './changeemail.module.scss'
import { Labeled, Input, Button, Card } from '../../components'
import Api from '../../utils/Api'
import { useCtx } from '../../utils/Hooks'
import { useHistory } from 'react-router-dom'

export default function ChangeEmail({ match }) {
  const [email, setEmail] = useState('')
  const { logout } = useCtx()
  const history = useHistory()

  function submit(e) {
    e.preventDefault()
    Api.changeEmailWithToken(match.params.token, email).then(
      ({ ok, message }) => {
        if (message === 'email in use') return alert('email already in use')
        if (ok !== 1) return alert('Something went wrong')
        alert('Email changed')
        logout()
        history.push('/login')
      }
    )
  }

  return (
    <Card className={styles.wrap}>
      <form className={styles.change} onSubmit={submit}>
        <Labeled
          label="new email"
          action={<Input type="email" value={email} onChange={setEmail} />}
        />
        <Button type="submit" accent>
          change email
        </Button>
      </form>
    </Card>
  )
}
