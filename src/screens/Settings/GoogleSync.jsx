import React, { useContext } from 'react'
import AppContext from 'components/AppContext'
import Api from 'utils/Api'
import { Button } from 'components'

export default function GoogleSync() {
  const ctx = useContext(AppContext)
  const isSynced = ctx.user && ctx.user.googleAccessToken

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
    <Button onClick={isSynced ? unlink : link} accent={!isSynced}>
      {isSynced ? 'Disconnect' : 'Connect Account'}
    </Button>
  )
}
