import React, { useState } from 'react'
import styles from './login.module.scss'
import { Labeled, Input, Button, Card } from '../../components'
import { Helmet } from 'react-helmet'
import { useCtx, useHistory } from '../../utils/Hooks'
import { mutations, useMutation } from '../../gql'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setCurrentUser } = useCtx()
  const history = useHistory()

  const [signIn] = useMutation(mutations.SIGN_IN, {
    onCompleted: ({ signIn: user }) => {
      if (!user) return
      setCurrentUser(user.id)
      history.push('/settings')
      localStorage.setItem('loggedin', true)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    signIn({ variables: { email, password } })
  }

  return (
    <>
      <Helmet>
        <title>Login | Upframe</title>
        <meta property="og:title" content="Login | Upframe"></meta>
        <meta
          property="og:description"
          content="Login to your account and start helping people."
        ></meta>
        <meta property="og:image" content="/media/logo-app-192.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <Card className={styles.wrap}>
        <form className={styles.login} onSubmit={handleSubmit}>
          <Labeled
            label="Email"
            action={<Input type="email" value={email} onChange={setEmail} />}
          />
          <Labeled
            label="Password"
            action={
              <Input type="password" value={password} onChange={setPassword} />
            }
          />
          <Button accent type="submit">
            Login
          </Button>
        </form>
      </Card>
    </>
  )
}
