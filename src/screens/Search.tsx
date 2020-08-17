import React from 'react'
import { Redirect } from 'react-router-dom'
import { useMatchMedia } from 'utils/hooks'
import { mobile } from 'styles/responsive'
import { queries, useQuery } from 'gql'
import type { SearchList, SearchListVariables } from 'gql/types'
import List from './Main/MentorList'
import Home from './Home'

export default function Search() {
  const isMobile = useMatchMedia(mobile)
  const query = new URLSearchParams(window.location.search).get('q') ?? ''
  const tags =
    new URLSearchParams(window.location.search).get('t')?.split(',') ?? []

  const { data } = useQuery<SearchList, SearchListVariables>(queries.SEARCH, {
    variables: { query, tags },
    skip: !query && !tags.length,
  })

  const users = data?.search?.users?.map(({ user }) => user) ?? []

  if (!isMobile && !query && !tags.length) return <Redirect to="/" />
  return <Home>{users.length > 0 && <List mentors={users} />}</Home>
}
