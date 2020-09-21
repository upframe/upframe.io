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

type Event = {
  id: string
  editor: string
  user: string
  date: Date
  field: string
  old: string
  new: string
}

const possessive = (name: string) =>
  /s$/i.test(name) ? `${name}'` : `${name}'s`

export default function Audit() {
  const [events, setEvents] = useState<Event[]>([])
  const [userIds, setUserIds] = useState<string[]>([])
  const [users, setUsers] = useState<{
    [id: string]: { name: string; handle: string }
  }>({})

  const { data } = useQuery<AuditTrail, AuditTrailVariables>(AUDIT_TRAIL, {
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
      const newIds = newEvents.flatMap(
        ({ editor, user }) =>
          [editor, user]
            .map(id => !userIds.includes(id) && id)
            .filter(Boolean) as string[]
      )
      if (newIds.length) setUserIds([...userIds, ...newIds].sort())
    },
  })

  const ids = JSON.stringify(userIds)

  useEffect(() => {
    const users = JSON.parse(ids)
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
  }, [ids])

  return (
    <S.Trail>
      {events.map(({ id, date, editor, user, field, ...v }) => (
        <S.Event key={id}>
          <span>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
          <span>
            <User {...{ id: editor, ...users[editor] }} /> changed{' '}
            <User
              id={user}
              {...(user in users && {
                name: possessive(users[user].name),
                handle: users[user].handle,
              })}
            />{' '}
            {field} from {v.old} to {v.new}
          </span>
        </S.Event>
      ))}
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
