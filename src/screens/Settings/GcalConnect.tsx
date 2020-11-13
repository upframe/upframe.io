import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { GoogleSignin } from 'components'
import { gql, useMutation } from 'gql'
import type * as T from 'gql/types'
import { nthOfClass } from 'utils/css'

const CONNECT_GCAL = gql`
  mutation ConnectGoogleCalendar($input: GoogleLoginInput!) {
    connectGCal(input: $input) {
      id
    }
  }
`

export default function GCalConnect() {
  const [code, setCode] = useState<string>()
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [connect] = useMutation<
    T.ConnectGoogleCalendar,
    T.ConnectGoogleCalendarVariables
  >(CONNECT_GCAL)

  useEffect(() => {
    if (!code || nthOfClass(ref.current) !== 0) return
    connect({
      variables: {
        input: {
          code,
          redirect: window.location.origin + window.location.pathname,
        },
      },
    })
  }, [code, connect, ref])

  return (
    <S.Wrap ref={ref}>
      <GoogleSignin
        label="Add Google Calendar"
        scope="CALENDAR"
        onCode={setCode}
      />
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    display: contents;
  `,
}
