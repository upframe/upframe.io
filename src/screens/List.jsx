import React from 'react'
import { Redirect } from 'react-router-dom'
import { queries, useQuery } from '../gql'
import { Spinner } from '../components'
import MentorList from './Main/MentorList'
import Home from './Home'

export default function List({ match }) {
  const [type, name] = match.url.split('/').slice(-2)
  const { data = {}, loading } = useQuery(
    type === 'list' ? queries.LIST : queries.TAG,
    {
      variables: { name: name.toLowerCase() },
    }
  )
  const list = type === 'list' ? data.list : data.tag

  if (list && name !== list.name) return <Redirect replace to={list.name} />
  if (loading) return <Spinner centered />
  if (!loading && !list) return <Redirect to="/404" />
  return (
    <Home>
      <MentorList mentors={list.users} />
    </Home>
  )
}
