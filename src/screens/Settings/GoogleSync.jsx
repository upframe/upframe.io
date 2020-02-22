import React from 'react'
import { Button } from 'components'
import { queries, useQuery } from '../../gql'

export default function GoogleSync() {
  const isSynced = false

  const { data: { calendarConnectUrl: url } = {} } = useQuery(
    queries.CONNECT_CALENDAR_URL
  )

  async function unlink() {}

  return (
    <Button accent {...(isSynced ? { onClick: unlink } : { linkTo: url })}>
      {isSynced ? 'Disconnect' : 'Connect Account'}
    </Button>
  )
}
