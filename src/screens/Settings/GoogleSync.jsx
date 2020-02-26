import React from 'react'
import { Button } from 'components'
import { queries, useQuery, client, mutations, useMutation } from '../../gql'

export default function GoogleSync() {
  const { data: { calendarConnectUrl: url } = {} } = useQuery(
    queries.CONNECT_CALENDAR_URL
  )

  const { me } = client.readQuery({
    query: queries.ME,
  })

  const [disconnect] = useMutation(mutations.DISCONNECT_CALENDAR, {
    onCompleted() {
      localStorage.removeItem('calendars')
    },
  })

  return (
    <Button
      accent
      {...(me.calendarConnected
        ? { onClick: disconnect }
        : {
            linkTo: url,
            onClick() {
              localStorage.removeItem('calendars')
            },
          })}
    >
      {me.calendarConnected ? 'Disconnect' : 'Connect Account'}
    </Button>
  )
}
