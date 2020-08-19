import React, { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedInputCall } from 'utils/hooks'
import { useQuery, gql } from 'gql'
import { CHAT_PARTICIPANT } from 'conversations/gql'
import { SearchInput } from 'components'
import Tab from './ConversationTab'

const SEARCH = gql`
  query SearchPerson($term: String!) {
    search(term: $term, maxUsers: 20) {
      users {
        user {
          ...ChatParticipant
        }
      }
    }
  }
  ${CHAT_PARTICIPANT}
`

export const FETCH_PARTICIPANT = gql`
  query FetchParticipant($id: ID!) {
    user(id: $id) {
      ...ChatParticipant
    }
  }
  ${CHAT_PARTICIPANT}
`

export default function SelectPerson({ selected, onSelection }) {
  const [searchValue, setSearchValue] = useState('')
  const inputFinal = useDebouncedInputCall(searchValue)

  const { data: { search: { users = [] } = {} } = {} } = useQuery(SEARCH, {
    variables: { term: inputFinal, skip: true },
  })

  return (
    <S.Select>
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search"
      />
      <S.ResultList>
        {[
          ...selected,
          ...(inputFinal.length === 0
            ? []
            : users.flatMap(({ user }) =>
                selected.find(({ id }) => id === user.id) ? [] : [user]
              )),
        ].map(user => (
          <Tab
            key={user.id}
            users={[user]}
            selected={selected.find(({ id }) => id === user.id)}
            onSelect={v =>
              onSelection(
                v
                  ? [...selected, user]
                  : selected.filter(({ id }) => id !== user.id)
              )
            }
          />
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
