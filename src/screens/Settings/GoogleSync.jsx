import React from 'react'
import { Button } from 'components'
import { queries, useQuery, mutations, useMutation } from '../../gql'
import { useMe } from '../../utils/hooks'

export default function GoogleSync() {
  const { data: { calendarConnectUrl: url } = {} } = useQuery(
    queries.CONNECT_CALENDAR_URL
  )

  const { me } = useMe()

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
