import React, { useState, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import styles from './signup.module.scss'
import { Labeled, Input, Button, Card } from '../../components'
import { Helmet } from 'react-helmet'
import { isEmail } from '../../utils/validate'
import { queries, mutations, useQuery, useMutation } from '../../gql'
import { notify } from '../../notification'
import { useCtx } from '../../utils/Hooks'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [valid, setValid] = useState(false)
  const history = useHistory()
  const { data: { me } = {} } = useQuery(queries.ME)
  const { setCurrentUser } = useCtx()

  const [signUp] = useMutation(mutations.SIGN_UP, {
    variables: { name, email, password },
    onCompleted({ createAccount: user }) {
      setCurrentUser(user.id)
      localStorage.setItem('loggedin', true)
      history.push('/settings')
    },
    onError({ graphQLErrors }) {
      graphQLErrors.forEach(err => {
        notify(err.message)
      })
    },
  })

  function submit(e) {
    e.preventDefault()
    signUp()
  }

  useEffect(() => {
    setValid(name.length >= 3 && password.length >= 8 && isEmail(email))
  }, [name, password, email])

  if (me) return <Redirect to="/settings" />
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
                placeholder="Awesome User"
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
          <Button accent type="submit" disabled={!valid}>
            Create Account
          </Button>
        </form>
      </Card>
    </>
  )
}
