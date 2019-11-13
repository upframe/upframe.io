import React from 'react'
import Api from 'utils/Api'
import styles from './GoogleSync.module.css'

export default function GoogleSync({ user }) {
  const isSynced = user && user.googleAccessToken

  async function link() {
    const { url } = await Api.getGoogleSyncUrl()
    window.location = url
  }

  async function unlink() {
    await Api.updateUserInfo({
      googleAccessToken: '',
      googleRefreshToken: '',
      upframeCalendarId: '',
    })
    window.location.reload()
  }

  return (
    <div className={styles.controls}>
      <button className="btn btn-secondary" onClick={isSynced ? unlink : link}>
        {isSynced ? 'Unlink Google' : 'Synchronize Google Account'}
      </button>
    </div>
  )
}
