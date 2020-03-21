import React from 'react'
import { Redirect } from 'react-router-dom'
import { queries, useQuery } from '../gql'
import { Spinner } from '../components'
import MentorList from './Main/MentorList'
import Home from './Home'

export default function List({ match }) {
  const name = match.url.split('/').pop()
  const { data: { list } = {}, loading } = useQuery(queries.LIST, {
    variables: { name },
  })

  if (loading) return <Spinner centered />
  if (!loading && !list) return <Redirect to="/404" />
  return (
    <Home>
      <MentorList mentors={list.users} />
    </Home>
  )
}
