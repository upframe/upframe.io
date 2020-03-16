import React from 'react'
import { Link } from 'react-router-dom'
import styles from './navigation.module.scss'
import { queries, useQuery } from '../../gql'

export default function Navigation() {
  const current = window.location.href.split('/').pop()
  const { data: { me = {} } = {} } = useQuery(queries.ME)

  const tabs = [
    { title: 'Public Profile', url: 'public' },
    { title: 'Account Settings', url: 'account' },
    { title: 'Notifications', url: 'notifications' },
    ...(me.role === 'MENTOR'
      ? [{ title: 'My Calendar', url: 'mycalendar' }]
      : []),
  ]

  return (
    <nav className={styles.navigation}>
      {tabs.map(({ title, url }) => (
        <Link
          className={[
            styles.item,
            ...(current === url ? [styles.active] : []),
          ].join(' ')}
          to={`/settings/${url}`}
          key={url}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
