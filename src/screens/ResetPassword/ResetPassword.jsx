import React, { useState } from 'react'
import styles from './resetpassword.module.scss'
import { Labeled, Input, Button, Card } from '../../components'
import Api from '../../utils/Api'
import { useCtx } from '../../utils/Hooks'
import { useHistory } from 'react-router-dom'

export default function Reset({ match }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const { logout } = useCtx()
  const history = useHistory()

  function submit(e) {
    e.preventDefault()
    Api.resetPasswordWithToken(match.params.token, password).then(({ ok }) => {
      if (ok !== 1) return alert('Something went wrong')
      alert('Password changed')
      logout()
      history.push('/login')
    })
  }

  return (
    <Card className={styles.wrap}>
      <form className={styles.reset} onSubmit={submit}>
        <Labeled
          label="new password"
          action={
            <Input type="password" value={password} onChange={setPassword} />
          }
        />
        <Labeled
          label="confirm password"
          action={
            <Input type="password" value={confirm} onChange={setConfirm} />
          }
        />
        <Button
          type="submit"
          accent
          disabled={password.length < 8 || password !== confirm}
        >
          change password
        </Button>
      </form>
    </Card>
  )
}
