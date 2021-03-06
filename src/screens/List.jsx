import React from 'react'
import { Redirect } from 'react-router-dom'
import { queries, useQuery } from 'gql'
import { Spinner } from '../components'
import MentorList from './Main/MentorList'
import Home from './Home'
import ListInfo from './Main/ListInfo'
import { notify } from 'notification'

export default function List({ match }) {
  const [type, name] = match.url
    .split('?')[0]
    .split('/')
    .filter(Boolean)
    .slice(-2)
  const { data = {}, loading } = useQuery(queries[type.toUpperCase()], {
    variables: { name: name.replace(/_/g, ' ').toLowerCase() },
  })
  const list = type === 'list' ? data.list : data.tag

  if (loading) return <Spinner centered />
  if (type === 'list' && name.replace(/_/g) !== list.name.replace(/\s/g))
    return <Redirect replace to={list.name.replace(/\s/g, '_')} />
  if (!loading && !list) return <Redirect to="/404" />
  if (list?.space?.handle) {
    notify(`The "${list.name}" list has been migrated to this space`)
    return <Redirect to={`/space/${list.space.handle}`} />
  }
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
