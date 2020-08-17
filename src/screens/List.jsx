import React from 'react'
import { Redirect } from 'react-router-dom'
import { queries, useQuery } from 'gql'
import { Spinner } from '../components'
import MentorList from './Main/MentorList'
import Home from './Home'
import ListInfo from './Main/ListInfo'

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
        : { name: name.replace(/_/g, ' ').toLowerCase() },
  })
  const list =
    type === 'list' ? data.list : type === 'tag' ? data.tag : data.search

  if (loading) return <Spinner centered />
  if (type === 'list' && name.replace(/_/g) !== list.name.replace(/\s/g))
    return <Redirect replace to={list.name.replace(/\s/g, '_')} />
  if (!loading && !list) return <Redirect to="/404" />
  return (
    <Home>
      {type === 'list' && (
        <ListInfo name={list.name} description={list.description} />
      )}
      <MentorList
        mentors={
          list.users?.map(user => ('user' in user ? user.user : user)) ?? []
        }
      />
    </Home>
  )
}
