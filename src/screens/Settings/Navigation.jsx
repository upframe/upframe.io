import React from 'react'
import { Link } from 'react-router-dom'
import styles from './navigation.module.scss'

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <Link className={styles.item} to="/settings/public">
        Public Profile
      </Link>
      <Link
        className={[styles.item, styles.active].join(' ')}
        to="/settings/account"
      >
        Account Settings
      </Link>
      <Link className={styles.item} to="/settings/notifications">
        Notifications
      </Link>
      <Link className={styles.item} to="/settings/sync">
        Calendar
      </Link>
    </nav>
  )
}
