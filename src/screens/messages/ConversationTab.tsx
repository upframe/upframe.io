import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ProfilePicture, Title, Text, Checkbox, Identicon } from 'components'
import { useMe } from 'utils/hooks'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'
import { gql, fragments, useQuery } from 'gql'
import type { Participants, ParticipantsVariables } from 'gql/types'
import { Conversation } from 'conversations'

const PARTICIPANTS = gql`
  query Participants($ids: [ID!]!) {
    users(ids: $ids) {
      ...PersonBase
    }
  }
  ${fragments.person.base}
`

interface Props {
  id: string
  selected?: boolean
  onSelect(v: boolean): void
  userIds?: string[]
  users?: Participants['users']
}

export default function User({
  id,
  selected,
  onSelect,
  userIds = [],
  users = [],
}: Props) {
  const [conversation, setConversation] = useState<Conversation>()
  const [hasUnread, setHasUnread] = useState(false)
  const { me } = useMe()
  userIds = userIds?.filter(id => id !== me?.id)

  const { data } = useQuery<Participants, ParticipantsVariables>(PARTICIPANTS, {
    variables: { ids: userIds },
    skip: !userIds?.length,
  })

  users = [...users, ...(data?.users ?? [])]

  const CondLink = id ? Link : React.Fragment

  useEffect(() => {
    if (typeof onSelect === 'function' || !id || conversation) return
    Conversation.get(id).then(setConversation)
  }, [id, onSelect, conversation])

  useEffect(() => {
    if (!conversation) return

    return conversation.on('message', () => {
      setHasUnread(true)
    })
  }, [conversation])

  if (!users.length) return null
  return (
    <S.User
      {...(typeof onSelect === 'function' && {
        onClick: () => onSelect(!selected),
      })}
    >
      {/* @ts-ignore */}
      <CondLink {...(id && { to: `${path(1)}/${id}` })}>
        {users.length > 1 ? (
          <Identicon ids={users} />
        ) : (
          <ProfilePicture imgs={users[0]?.profilePictures} size="3rem" />
        )}
        <S.TextSec>
          <Title size={4}>
            {users.length === 1
              ? users[0].name
              : users.map(({ name }) => name.split(' ')[0]).join(', ')}
          </Title>
          <Text>
            {users.length > 1
              ? `${users.length + 1} participants`
              : users[0]?.headline ?? '\u00a0'}
          </Text>
        </S.TextSec>
        {typeof onSelect === 'function' && (
          <Checkbox checked={selected as boolean} onChange={onSelect} />
        )}
        {hasUnread && <S.Unread />}
      </CondLink>
    </S.User>
  )
}

const S = {
  User: styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    margin: 1rem 0;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    min-width: 0;
    box-sizing: border-box;
    user-select: none;

    picture,
    img {
      border-radius: 50%;
    }

    &:hover {
      background-color: #0000000c;
    }

    input {
      flex-shrink: 0;
      margin-left: 0.5rem;
    }

    & > a {
      display: contents;
    }
  `,

  TextSec: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex-grow: 1;
    padding-left: 1rem;
    box-sizing: border-box;
    min-width: 0;

    * {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex: 0 1 auto;
    }
  `,

  Unread: styled.div`
    display: block;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    background-color: var(--cl-accent);
  `,
}
