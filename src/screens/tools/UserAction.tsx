import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Title, Text, Spinner, Tagselect } from 'components'
import { useQuery, queries, gql } from 'gql'
import api from 'api'
import type { AllLists, UserListNames, UserListNamesVariables } from 'gql/types'
import type { Tag } from 'components/TagInput'

const listActions = ['Add to List', 'Remove from List'] as const
const tagActions = ['Add Tags', 'Remove Tags'] as const
export const actions = [
  ...listActions,
  ...tagActions,
  'Delete Account',
] as const

type ListAction = typeof listActions[number]
type TagAction = typeof tagActions[number]

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

export const ADD_USER_TAGS = gql`
  mutation AdminAddUserTags($tags: [Int!]!, $users: [ID!]!) {
    addUserTags(tags: $tags, users: $users)
  }
`

export const REMOVE_USER_TAGS = gql`
  mutation AdminRemoveUserTags($tags: [Int!]!, $users: [ID!]!) {
    removeUserTags(tags: $tags, users: $users)
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
  const [tags, setTags] = useState<number[]>([])

  function onConfirm() {
    setLoading(true)

    const mutationPayload = (): any => {
      switch (action) {
        case 'Add to List':
          return { mutation: ADD_TO_LIST, variables: { users, list } }
        case 'Remove from List':
          return { mutation: REMOVE_FROM_LIST, variables: { users, list } }
        case 'Add Tags':
          return { mutation: ADD_USER_TAGS, variables: { users, tags } }
        case 'Remove Tags':
          return { mutation: REMOVE_USER_TAGS, variables: { users, tags } }
        case 'Delete Account':
          return { mutation: DELETE_ACCOUNTS, variables: { users } }
        default:
          throw Error(`unhandled mutation '${action}'`)
      }
    }

    api.mutate(mutationPayload()).then(() => {
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
            {listActions.includes(action as ListAction) && (
              <ListAction
                action={action as ListAction}
                {...{ users, list, setList }}
              />
            )}
            {tagActions.includes(action as TagAction) && (
              <TagAction setTags={setTags} />
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
                  !(
                    action === 'Delete Account' ||
                    typeof list === 'number' ||
                    tags.length
                  )
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

function TagAction({ setTags: setTagIds }: { setTags(tags: number[]): void }) {
  const [tags, setTags] = useState<Tag[]>([])

  return (
    <Tagselect
      selection={tags}
      onChange={tag => {
        setTags(tag)
        setTagIds(tag.map(({ id }) => id))
      }}
      canAdd={false}
    />
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
