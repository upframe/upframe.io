import React from 'react'
import { Redirect } from 'react-router-dom'
import { queries, useQuery } from 'gql'
import { Spinner } from '../components'
import MentorList from './Main/MentorList'
import Home from './Home'

export default function List({ match }) {
  const [type, name] = match.url
    .split('?')[0]
    .split('/')
    .filter(Boolean)
    .slice(-2)
  const { data = {}, loading } = useQuery(queries[type.toUpperCase()], {
    variables:
      type === 'search'
        ? {
            query: new URLSearchParams(window.location.search).get('q'),
            tags: (
              new URLSearchParams(window.location.search).get('t') || ''
            ).split(','),
          }
        : { name: name?.toLowerCase() },
  })
  const list =
    type === 'list' ? data.list : type === 'tag' ? data.tag : data.search

  if (list && name !== list.name && !loading)
    return <Redirect replace to={list.name} />
  if (loading) return <Spinner centered />
  if (!loading && !list) return <Redirect to="/404" />
  return (
    <Home>
      <MentorList
        mentors={list.users.map(user => ('user' in user ? user.user : user))}
      />
    </Home>
  )
}
