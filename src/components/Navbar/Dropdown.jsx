import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './dropdown.module.scss'
import { useMe, useSignOut } from '../../utils/hooks'
import { mutations, useMutation } from '../../gql'

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

  return (
    <nav
      className={styles.dropdown}
      tabIndex={0}
      ref={ref}
      onBlur={() => setTimeout(onBlur, 100)}
    >
      <Link to={`/${me ? me.handle : ''}`}>My Profile</Link>
      <Link to={`/settings/public`}>Settings</Link>
      <p onClick={signOut}>Sign out</p>
    </nav>
  )
}
