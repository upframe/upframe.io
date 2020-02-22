import React, { useEffect } from 'react'
import { Spinner, Title } from '../../components'
import styles from './sync.module.scss'
import { useHistory } from 'react-router-dom'
import { mutations, useMutation } from '../../gql'
import { notify } from '../../notification'

export default function Sync({ location }) {
  const history = useHistory()

  const [connect] = useMutation(mutations.CONNECT_CALENDAR, {
    onError() {
      notify("couldn't connect calendar")
    },
    onCompleted() {
      history.push('/settings/mycalendar')
    },
  })

  useEffect(() => {
    const { code } = Object.fromEntries(
      location.search
        .replace(/^\?(.+)/, '$1')
        .split('&')
        .map(v => v.split('='))
    )
    if (!code) return

    connect({ variables: { code } })
  }, [location.search, connect])

  return (
    <div className={styles.sync}>
      <Title s3>Syncing… You wil be redirected shortly</Title>
      <Spinner />
    </div>
  )
}
