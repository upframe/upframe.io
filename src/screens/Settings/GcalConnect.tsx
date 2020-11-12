import React from 'react'
import { GoogleSignin } from 'components'

export default function GCalConnect() {
  return <GoogleSignin label="Add Google Calendar" scope="CALENDAR" />
}
