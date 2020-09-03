import React from 'react'
import { Link } from 'react-router-dom'
import styles from './logo.module.scss'
import { useMentors } from 'utils/hooks'

export default function Logo({ home = false, onClick }) {
  const { set: shuffle } = useMentors()
  const Img = <img className={styles.logo} src="/logo.svg" alt="Upframe logo" />
  if (!home) return Img
  return (
    <Link
      to="/"
      className={styles.link}
      onClick={e => {
        if (window.location.pathname === '/') e.preventDefault()
        shuffle()
        if (onClick) onClick()
      }}
    >
      {Img}
    </Link>
  )
}
