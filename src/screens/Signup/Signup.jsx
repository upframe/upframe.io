import React, { useState, useEffect } from 'react'
import styles from './signup.module.scss'
import { Labeled, Input, Button, Card } from '../../components'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { isEmail } from '../../utils/validate'
import Api from '../../utils/Api'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [devPass, setDevPass] = useState('')
  const [valid, setValid] = useState(false)
  const history = useHistory()

  function submit(e) {
    e.preventDefault()
    Api.register(email, password, name, devPass).then(({ ok, message }) => {
      if (ok !== 1) return alert(message)
      Api.login(email, password).then(({ ok }) => {
        if (ok === 1) return history.push('/settings/public')
        alert('Could not log you in')
        history.push('/login')
      })
    })
  }

  useEffect(() => {
    setValid(
      name.length >= 3 &&
        password.length >= 8 &&
        devPass.length &&
        isEmail(email)
    )
  }, [name, password, devPass, email])

  return (
    <>
      <Helmet>
        <title>Register | Upframe</title>
        <meta property="og:title" content="Register | Upframe"></meta>
        <meta
          property="og:description"
          content="Register for Connect by Upframe"
        ></meta>
        <meta property="og:image" content="/media/logo-app-192.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <Card className={styles.wrap}>
        <form className={styles.signup} onSubmit={submit}>
          <Labeled
            label="Name"
            action={
              <Input
                placeholder="Awesome Mentor"
                value={name}
                onChange={setName}
              />
            }
          />
          <Labeled
            label="Email"
            action={
              <Input
                type="email"
                placeholder="awesome@upframe.io"
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
                placeholder="Sup3r S4f3 P4ssw0rd"
                value={password}
                onChange={setPassword}
              />
            }
          />
          <Labeled
            label="Upframe Dev Mode Pass"
            action={
              <Input
                type="password"
                placeholder="Nuclear code"
                value={devPass}
                onChange={setDevPass}
              />
            }
          />
          <Button accent type="submit" disabled={!valid}>
            Create Account
          </Button>
        </form>
      </Card>
    </>
  )
}
