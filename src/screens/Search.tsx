import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { useMatchMedia } from 'utils/hooks'
import { mobile } from 'styles/responsive'
import { queries, useQuery } from 'gql'
import type { SearchList, SearchListVariables, Lists } from 'gql/types'
import List from './Main/MentorList'
import Home from './Home'
import { SearchBar, ListCard } from 'components'

export default function Search() {
  const isMobile = useMatchMedia(mobile)
  const query = new URLSearchParams(window.location.search).get('q') ?? ''
  const tags =
    new URLSearchParams(window.location.search).get('t')?.split(',') ?? []

  const { data } = useQuery<SearchList, SearchListVariables>(queries.SEARCH, {
    variables: { query, tags },
    skip: !query && !tags.length,
  })
  const users = data?.search?.users?.map(({ user }) => user)

  const { data: { lists = [] } = {} } = useQuery<Lists>(queries.LISTS)

  if (!isMobile && !query && !tags.length) return <Redirect to="/" />
  return (
    <Home>
      <SearchBar />
      {!users && (
        <S.Lists>
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </S.Lists>
      )}
      {users && <List mentors={users} />}
    </Home>
  )
}

const S = {
  Lists: styled.div`
    display: flex;
    flex-direction: column;
    z-index: -1;

    & > * {
      height: calc(var(--list-width) * 0.34);
      margin-left: 0 !important;
      margin-top: 1rem;
      flex-shrink: 0;
    }
  `,
}
