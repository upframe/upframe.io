import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Spinner } from 'components'
import { useMe } from 'utils/hooks'

export default function AdminRoute(props) {
  const { loading } = useMe()
  console.log("eewe")
  if (loading) return <Spinner centered />
  //if (me?.role !== 'ADMIN') return <Redirect to="/404" />
  return <Route {...props} />
}
