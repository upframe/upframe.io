import React, { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedInputCall } from 'utils/hooks'
import { useQuery, gql } from 'gql'
import { SearchInput } from 'components'
import User from './User'

const SEARCH = gql`
  query Search($term: String!) {
    search(term: $term, maxUsers: 20) {
      users {
        user {
          id
          name
          headline
          profilePictures {
            size
            type
            url
          }
        }
      }
    }
  }
`

export default function SelectPerson() {
  const [searchValue, setSearchValue] = useState('')
  const inputFinal = useDebouncedInputCall(searchValue)

  const { data: { search: { users = [] } = {} } = {} } = useQuery(SEARCH, {
    variables: { term: inputFinal },
  })

  return (
    <S.Select>
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search"
      />
      <S.ResultList>
        {users.map(({ user }) => (
          <User key={user.id} {...user} />
        ))}
      </S.ResultList>
    </S.Select>
  )
}

const S = {
  Select: styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: hidden;
    margin: 0 calc(var(--side-margin) * -1);
    padding: 0 var(--side-margin);
    box-sizing: border-box;

    & > div {
      margin: 0 calc(var(--side-margin) * -0.5);
      width: calc(100% + var(--side-margin));
      flex-shrink: 0;
    }
  `,

  ResultList: styled.ul`
    padding: 0 0.5rem;
    flex-grow: 1;
    overflow-y: auto;
    margin: 0 calc(var(--side-margin) * -1);
  `,
}
