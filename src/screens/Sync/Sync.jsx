import React, { useEffect } from 'react'
import { Spinner, Title } from '../../components'
import styles from './sync.module.scss'
import Api from '../../utils/Api'
import { useCtx } from '../../utils/Hooks'
import { useHistory } from 'react-router-dom'

export default function Sync() {
  const { saveUserInfo } = useCtx()
  const history = useHistory()

  useEffect(() => {
    if (!saveUserInfo || !history) return
    Api.getTokens(window.location.search.split('?code=')[1]).then(
      ({ ok, token, refreshToken }) => {
        if (!ok) return
        fetch('https://www.googleapis.com/calendar/v3/calendars', {
          method: 'POST',
          mode: 'cors',
          BODY: JSON.stringify({ summary: 'Upframe Calendar' }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then(({ ok, id }) => {
          if (!ok) return alert('something went wrong')
          saveUserInfo({
            googleAccessToken: token,
            googleRefreshToken: refreshToken,
            upframeCalendarId: id,
          })
          history.push('/settings/mycalendar')
        })
      }
    )
  }, [saveUserInfo, history])

  return (
    <div className={styles.sync}>
      <Title s3>Syncing… You wil be redirected shortly</Title>
      <Spinner />
    </div>
  )
}
