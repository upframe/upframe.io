import React from 'react'
import { Link } from 'react-router-dom'
import styles from './logo.module.scss'

export default function Logo({ home = false, onClick }) {
  const Img = <img className={styles.logo} src="/logo.svg" alt="Upframe logo" />
  if (!home) return Img
  return (
    <Link to="/" className={styles.link} {...(onClick && { onClick })}>
      {Img}
    </Link>
  )
}
