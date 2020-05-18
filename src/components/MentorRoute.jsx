import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Spinner } from 'components'
import { useMe } from 'utils/hooks'

export default function MentorRoute(props) {
  const { me, loading } = useMe()

  if (loading) return <Spinner centered />
  if (me.role === 'USER') return <Redirect to="/404" />
  return <Route {...props} />
}
