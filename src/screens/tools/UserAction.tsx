import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Title, Text, Spinner } from 'components'
import { useQuery, queries, gql } from 'gql'
import type { AllLists, UserListNames, UserListNamesVariables } from 'gql/types'
import api from 'api'

const listActions = ['Add to List', 'Remove from List'] as const
export const actions = [...listActions, 'Delete Account'] as const

const ADD_TO_LIST = gql`
  mutation AdminAddToList($list: Int!, $users: [ID!]!) {
    addToList(listId: $list, userIds: $users) {
      id
    }
  }
`

const REMOVE_FROM_LIST = gql`
  mutation AdminRemoveFromList($list: Int!, $users: [ID!]!) {
    removeFromList(listId: $list, userIds: $users) {
      id
    }
  }
`

export const DELETE_ACCOUNTS = gql`
  mutation AdminDeleteAccounts($users: [ID!]!) {
    removeAccounts(users: $users)
  }
`

interface Props<T extends readonly string[] = typeof actions> {
  action: T[number]
  users: string[]
  onDone?(): void
  onCancel?(): void
}

export default function UserAction({ action, users, onDone, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const { data: { users: userInfo = [] } = {} } = useQuery<
    UserListNames,
    UserListNamesVariables
  >(queries.USER_LIST_NAMES, { variables: { ids: users } })
  const [list, setList] = useState<number>()

  function onConfirm() {
    setLoading(true)
    api
      .mutate({
        ...(action === 'Add to List'
          ? { mutation: ADD_TO_LIST, variables: { users, list } }
          : action === 'Remove from List'
          ? { mutation: REMOVE_FROM_LIST, variables: { users, list } }
          : { mutation: DELETE_ACCOUNTS, variables: { users } }),
      })
      .then(() => {
        setLoading(true)
        onDone?.()
      })
  }

  return (
    <S.Background onClick={onCancel}>
      <S.Modal onClick={e => e.stopPropagation()}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Title size={3}>{action}</Title>
            {action !== 'Delete Account' && (
              <ListAction {...{ action, users, list, setList }} />
            )}
            <ul>
              {userInfo.map(({ id, name }) => (
                <li key={id}>{name}</li>
              ))}
            </ul>
            <S.Actions>
              <Button onClick={onCancel}>Cancel</Button>
              <Button
                accent
                disabled={
                  !(action === 'Delete Account' || typeof list === 'number')
                }
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </S.Actions>
          </>
        )}
      </S.Modal>
    </S.Background>
  )
}

function ListAction({
  action,
  users,
  list,
  setList,
}: Props<typeof listActions> & {
  list?: number
  setList(v?: number): void
}) {
  const { data: { lists = [] } = {} } = useQuery<AllLists>(
    queries.ALL_LIST_NAMES
  )

  return (
    <>
      <Text>
        {action === 'Add to List' ? 'Add' : 'Remove'} {users.length} user
        {users.length > 1 ? 's' : ''}{' '}
        {action === 'Add to List' ? 'to ' : 'from '}
        <select
          value={lists.find(({ id }) => id === list)?.name ?? 'list'}
          onChange={({ target }) => {
            setList(lists.find(({ name }) => name === target.value)?.id)
          }}
        >
          <option disabled>list</option>
          {lists
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ id, name }) => (
              <option key={id}>{name}</option>
            ))}
        </select>
      </Text>
    </>
  )
}

const S = {
  Background: styled.div`
    position: fixed;
    display: block;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3000;
    background-color: #0008;

    @supports (backdrop-filter: blur(12px)) {
      background-color: #0002;
      backdrop-filter: blur(5px);
    }
  `,

  Modal: styled.div`
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -50%);
    min-width: 20rem;
    padding: 1rem 2rem;
    display: block;
    background-color: #fff;
    border-radius: 0.25rem;

    & > *:first-child {
      margin-top: 0;
    }

    ul {
      max-height: min(20rem, 40vh);
      overflow-y: auto;
    }
  `,

  Actions: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;

    button:last-of-type {
      margin-right: 0;
    }
  `,
}
