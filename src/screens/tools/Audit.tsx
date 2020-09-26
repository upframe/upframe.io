import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { gql, useQuery, queries } from 'gql'
import { Spinner } from 'components'
import api from 'api'
import type {
  AuditTrail,
  AuditTrailVariables,
  UserListNames,
  UserListNamesVariables,
  AllLists,
  TagListNames,
  TagListNamesVariables,
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
  userName: string
  tag: number
}

const possessive = (name: string) =>
  /s$/i.test(name) ? `${name}'` : `${name}'s`

export default function Audit() {
  const [events, setEvents] = useState<Event[]>([])
  const [userIds, setUserIds] = useState<string[]>([])
  const [users, setUsers] = useState<{
    [id: string]: { name: string; handle: string }
  }>({})
  const [tagIds, setTagIds] = useState<number[]>([])
  const [tags, setTags] = useState<{ [id: string]: string }>({})
  const { data: { lists = [] } = {} } = useQuery<AllLists>(
    queries.ALL_LIST_NAMES
  )

  const { loading } = useQuery<AuditTrail, AuditTrailVariables>(AUDIT_TRAIL, {
    variables: { trails: ['admin_edits'] },
    fetchPolicy: 'network-only',
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

      const newTags = newEvents
        .map(({ tag }) => !tagIds.includes(tag) && tag)
        .filter(Boolean) as number[]
      if (newTags.length) setTagIds([...tagIds, ...newTags].sort())
    },
  })

  const _userIds = JSON.stringify(userIds)
  useEffect(() => {
    const users = JSON.parse(_userIds)
    if (!users.length) return
    api
      .query<UserListNames, UserListNamesVariables>({
        query: queries.USER_LIST_NAMES,
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

  const _tagIds = JSON.stringify(tagIds)
  useEffect(() => {
    const tags = JSON.parse(_tagIds)
    if (!tags.length) return
    api
      .query<TagListNames, TagListNamesVariables>({
        query: queries.TAG_LIST_NAMES,
        variables: { ids: tags },
      })
      .then(({ data }) =>
        setTags(Object.fromEntries(data.tags.map(({ id, name }) => [id, name])))
      )
  }, [_tagIds])

  const formatUser = (id: string, p = false) => (
    <User
      id={id}
      {...(id in users &&
        (!p
          ? users[id]
          : { name: possessive(users[id].name), handle: users[id].handle }))}
    />
  )

  if (loading) return <Spinner />
  return (
    <S.Trail>
      {events.map(
        ({
          id,
          date,
          editor,
          user,
          field,
          eventType,
          list,
          userName,
          tag,
          ...v
        }) => (
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
              ) : eventType === 'remove_from_list' ? (
                <>
                  {formatUser(editor)} removed {formatUser(user)} from list '
                  {lists.find(({ id }) => id === list)?.name ?? list}'
                </>
              ) : eventType === 'remove_account' ? (
                <>
                  {formatUser(editor)} deleted {formatUser(user)}{' '}
                  {possessive(userName)} account
                </>
              ) : eventType === 'add_tag' ? (
                <>
                  {formatUser(editor)} added tag '{tags[tag] ?? tag}' to user{' '}
                  {formatUser(user)}
                </>
              ) : eventType === 'remove_tag' ? (
                <>
                  {formatUser(editor)} removed tag '{tags[tag] ?? tag}' from
                  user {formatUser(user)}
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
