import React, { useState } from 'react'
import styled from 'styled-components'
import { useDebouncedInputCall, useMe } from 'utils/hooks'
import { useQuery, gql } from 'gql'
import { CHAT_PARTICIPANT } from 'conversations/gql'
import { SearchInput } from 'components'
import Tab from './ConversationTab'
import type { SearchPerson, SearchPersonVariables } from 'gql/types'

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

interface Props {
  selected: Participant[]
  onSelection(v: Participant[]): void
}

export default function SelectPerson({ selected, onSelection }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const inputFinal = useDebouncedInputCall(searchValue)
  const { me } = useMe()

  const { data } = useQuery<SearchPerson, SearchPersonVariables>(SEARCH, {
    variables: { term: inputFinal },
  })
  const users = (data?.search?.users ?? []).filter(
    ({ user }) => user.id !== me?.id
  )

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
            selected={!!selected.find(({ id }) => id === user.id)}
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

    & > input > svg {
      background: red;
    }
  `,

  ResultList: styled.ul`
    padding: 0 0.5rem;
    flex-grow: 1;
    overflow-y: auto;
    margin: 0 calc(var(--side-margin) * -1);
  `,
}
