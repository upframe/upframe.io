import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { gql, useQuery } from 'gql'
import api from 'api'
import type {
  AuditTrail,
  AuditTrailVariables,
  TrailUsers,
  TrailUsersVariables,
  TrailLists,
} from 'gql/types'

const AUDIT_TRAIL = gql`
  query AuditTrail($trails: [ID!]!) {
    audit(trails: $trails) {
      id
      trailId
      date
      payload
    }
  }
`

const TRAIL_USERS = gql`
  query TrailUsers($ids: [ID!]!) {
    users(ids: $ids) {
      id
      name
      handle
    }
  }
`

const TRAIL_LISTS = gql`
  query TrailLists {
    lists(includeUnlisted: true) {
      id
      name
    }
  }
`

type Event = {
  id: string
  editor: string
  user: string
  date: Date
  field: string
  old: string
  new: string
  eventType: string
  list: number
}

const possessive = (name: string) =>
  /s$/i.test(name) ? `${name}'` : `${name}'s`

export default function Audit() {
  const [events, setEvents] = useState<Event[]>([])
  const [userIds, setUserIds] = useState<string[]>([])
  const [users, setUsers] = useState<{
    [id: string]: { name: string; handle: string }
  }>({})
  const { data: { lists = [] } = {} } = useQuery<TrailLists>(TRAIL_LISTS)

  useQuery<AuditTrail, AuditTrailVariables>(AUDIT_TRAIL, {
    variables: { trails: ['admin_edits'] },
    onCompleted({ audit }) {
      const newEvents: Event[] = []
      for (const event of audit) {
        const data: Event = { ...event, ...JSON.parse(event.payload) }
        newEvents.push({ ...data, date: new Date(event.date) })
      }
      setEvents(
        [...events, ...newEvents].sort((a, b) => (a.id > b.id ? -1 : 1))
      )

      const newUsers = newEvents.flatMap(
        ({ editor, user }) =>
          [editor, user]
            .map(id => !userIds.includes(id) && id)
            .filter(Boolean) as string[]
      )
      if (newUsers.length) setUserIds([...userIds, ...newUsers].sort())
    },
  })

  const _userIds = JSON.stringify(userIds)
  useEffect(() => {
    const users = JSON.parse(_userIds)
    if (!users.length) return
    api
      .query<TrailUsers, TrailUsersVariables>({
        query: TRAIL_USERS,
        variables: { ids: users },
      })
      .then(({ data }) =>
        setUsers(
          Object.fromEntries(
            data.users.map(({ id, name, handle }) => [id, { name, handle }])
          )
        )
      )
  }, [_userIds])

  const formatUser = (id: string, p = false) => (
    <User
      id={id}
      {...(id in users &&
        (!p
          ? users[id]
          : { name: possessive(users[id].name), handle: users[id].handle }))}
    />
  )

  return (
    <S.Trail>
      {events.map(
        ({ id, date, editor, user, field, eventType, list, ...v }) => (
          <S.Event key={id}>
            <span>
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </span>
            <span>
              {eventType === 'edit_user_info' ? (
                <>
                  {formatUser(editor)} changed {formatUser(user, true)} {field}{' '}
                  from {v.old} to {v.new}
                </>
              ) : eventType === 'add_to_list' ? (
                <>
                  {formatUser(editor)} added {formatUser(user)} to list '
                  {lists.find(({ id }) => id === list)?.name ?? list}'
                </>
              ) : (
                'unknown event type'
              )}
            </span>
          </S.Event>
        )
      )}
    </S.Trail>
  )
}

function User({
  id,
  name,
  handle,
}: {
  id: string
  name?: string
  handle?: string
}) {
  if (!handle) return <span>{name ?? id}</span>
  return <Link to={`/${handle}`}>{name ?? id}</Link>
}

const S = {
  Trail: styled.ol`
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
    padding-left: 5vw;
  `,

  Event: styled.li`
    display: contents;

    a {
      cursor: pointer;
      color: var(--cl-secondary);
      text-decoration: underline;
    }
  `,
}
