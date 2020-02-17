import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './dropdown.module.scss'
import { useCtx, useHistory } from '../../utils/Hooks'
import { mutations, useMutation } from '../../gql'

export default function Dropdown({ onBlur }) {
  const ref = useRef()
  const ctx = useCtx()
  const history = useHistory()

  const [signOut] = useMutation(mutations.SIGN_OUT, {
    onCompleted() {
      ctx.setCurrentUser(null)
      history.push('/login')
    },
  })

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [ref])

  return (
    <nav
      className={styles.dropdown}
      tabIndex={0}
      ref={ref}
      onBlur={() => setTimeout(onBlur, 100)}
    >
      <Link to={`/${ctx.currentUser}`}>My Profile</Link>
      <Link to={`/settings/public`}>Settings</Link>
      <p onClick={signOut}>Sign out</p>
    </nav>
  )
}
