import React from 'react'
import styled from 'styled-components'
import type { QueryAuditTrail_audit } from 'gql/types'
import { useComputed } from 'utils/hooks'
import { Link } from 'react-router-dom'

const formatDate = (date: Date) =>
  `${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}, ${date.getFullYear()}  ${date.toLocaleTimeString('en-US')}`

const Abbr: React.FC<{ limit?: number }> = ({ limit = 20, children }) => {
  if (typeof children !== 'string') return null
  if (children.length <= limit) return <S.Abbr as="span">{children}</S.Abbr>
  return <S.Abbr title={children}>{children.slice(0, limit)}…</S.Abbr>
}

interface Props {
  log: QueryAuditTrail_audit
}

export default function Log({ log }: Props) {
  const message = useComputed(log, buildMessage, 'json')
  const time = useComputed(new Date(log.date), formatDate, 'json')

  return (
    <S.Log>
      {message}
      <S.Time>{time}</S.Time>
    </S.Log>
  )
}

type AuditEvent = QueryAuditTrail_audit & {
  eventType: string
  editor: string
  [k: string]: string
}

function buildMessage(raw: QueryAuditTrail_audit) {
  const log: AuditEvent = { ...JSON.parse(raw.payload), ...raw }

  const format = (id: string | undefined, type: 'user' | 'space' = 'user') => {
    const user = log.objects?.find(o => o.id === id)
    if (!user) return id
    return (
      <Link
        to={`/${type === 'space' ? 'space/' : ''}${user.handle}`}
        data-type={type}
      >
        {user.name}
      </Link>
    )
  }

  const Msg = S.Message
  const editor = format(log.editor)
  const space = format(log.space, 'space')
  const user = format(log.user)
  const spaceRole = log.owner ? 'owner' : log.mentor ? 'mentor' : 'founder'

  switch (log.eventType) {
    case 'create_space':
      return (
        <Msg>
          {editor} created {space}
        </Msg>
      )
    case 'add_user':
      return (
        <Msg>
          {editor} added {user} to {space}
        </Msg>
      )
    case 'change_member_role': {
      const added = log.mentor || log.owner
      return (
        <Msg>
          {editor} {added ? 'added' : 'removed'} {space} {added ? 'to' : 'from'}{' '}
          {'mentor' in log ? 'mentors' : 'owners'}
        </Msg>
      )
    }
    case 'upload_cover_photo':
    case 'upload_space_photo':
      return (
        <Msg>
          {editor} uploaded a new {log.eventType.split('_')[1]} image
        </Msg>
      )
    case 'remove_member':
      return log.editor === log.user ? (
        <Msg>
          {editor} left {space}
        </Msg>
      ) : (
        <Msg>
          {editor} removed {user} from {space}
        </Msg>
      )
    case 'join_space':
      return (
        <Msg>
          {editor} joined {space} as a {spaceRole}
        </Msg>
      )
    case 'create_invite_link':
      return (
        <Msg>
          {editor} created an invite link for {spaceRole}s
        </Msg>
      )
    case 'revoke_invite_link':
      return (
        <Msg>
          {editor} revoked a {spaceRole} invite link
        </Msg>
      )
    case 'change_space_info':
      return (
        <Msg>
          {editor} changed {space}'s {log.field} from <Abbr>{log.old}</Abbr> to{' '}
          <Abbr>{log.new}</Abbr>
        </Msg>
      )
    default:
      return (
        <Msg as="pre">
          {JSON.stringify(raw.payload)
            .slice(2, -2)
            .replace(/(?<=:\s*)\\"|\\"(?=,|$)/g, '"')
            .replace(/\\"/g, '')
            .replace(/,/g, '\n')
            .replace(/:\s*/g, ': ')}
        </Msg>
      )
  }
}

const S = {
  Log: styled.li`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;

    &:not(:last-child) {
      border-bottom: 1px dashed #0003;
    }
  `,

  Message: styled.p`
    font-size: 1rem;
    margin: 0;

    a {
      color: var(--cl-accent);
      text-decoration: underline;
    }

    a[data-type='space'] {
      color: var(--cl-secondary);
    }
  `,

  Time: styled.span`
    font-size: 0.9rem;
    margin-top: 1rem;
    white-space: pre;
  `,

  Abbr: styled.abbr`
    font-style: italic;
    opacity: 0.7;
    text-decoration: underline dashed;
    text-underline-position: below;
    text-decoration-color: #0005;
    transition: text-decoration-color 0.1s ease;

    &:hover {
      text-decoration-color: var(--cl-primary);
    }
  `,
}
