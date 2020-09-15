import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './dropdown.module.scss'
import { useMe, useSignOut } from 'utils/hooks'
import { mutations, useMutation } from 'gql'

export default function Dropdown({ onBlur }) {
  const ref = useRef()
  const { me } = useMe()
  const afterSignOut = useSignOut()

  const [signOut] = useMutation(mutations.SIGN_OUT, {
    onCompleted: afterSignOut,
  })

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [ref])

  const onClick = () => {
    window.addEventListener(
      'mouseup',
      () => {
        setTimeout(onBlur, 100)
      },
      { once: true }
    )
  }

  return (
    <nav className={styles.dropdown} tabIndex={0} ref={ref} onBlur={onClick}>
      <Link to={`/${me ? me.handle : ''}`}>My Profile</Link>
      <Link to={`/settings/public`}>Settings</Link>
      {me.role === 'ADMIN' && <Link to={'/admin'}>Admin</Link>}
      <p onClick={signOut}>Sign out</p>
    </nav>
  )
}
