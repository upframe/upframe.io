import React from 'react'
import { Button } from 'components'
import { gql, useQuery, mutations, useMutation } from 'gql'
import { useMe } from 'utils/hooks'

const CONNECT_CALENDAR_URL = gql`
  query GetCalendarConnectUrl($redirect: String!) {
    calendarConnectUrl(redirect: $redirect)
  }
`

export default function GoogleSync({ loading = false }) {
  const { data: { calendarConnectUrl: url } = {} } = useQuery(
    CONNECT_CALENDAR_URL,
    {
      variables: {
        redirect: `${window.location.origin}/settings/calendar`,
      },
    }
  )

  const { me } = useMe()

  const [disconnect] = useMutation(mutations.DISCONNECT_CALENDAR, {
    onCompleted() {
      localStorage.removeItem('calendars')
    },
  })

  return (
    <Button
      loading={loading}
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
