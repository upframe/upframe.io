import React from 'react'
import styled from 'styled-components'
import type { QueryAuditTrail_audit } from 'gql/types'
import { useComputed } from 'utils/hooks'
import { Link } from 'react-router-dom'

interface Props {
  log: QueryAuditTrail_audit
}

const formatDate = (date: Date) =>
  `${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}, ${date.getFullYear()} ${date.toLocaleTimeString('en-US')}`

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

  switch (log.eventType) {
    case 'create_space':
      return (
        <S.Message>
          {format(log.editor)} created {format(log.space, 'space')}
        </S.Message>
      )
    case 'add_user':
      return (
        <S.Message>
          {format(log.editor)} added {format(log.user)} to{' '}
          {format(log.space, 'space')}
        </S.Message>
      )
    default:
      return (
        <S.Message as="pre">
          {JSON.stringify(raw.payload)
            .slice(2, -2)
            .replace(/(?<=:\s*)\\"|\\"(?=,|$)/g, '"')
            .replace(/\\"/g, '')
            .replace(/,/g, '\n')
            .replace(/:\s*/g, ': ')}
        </S.Message>
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

      &::before,
      &::after {
        content: "'";
      }
    }
  `,

  Time: styled.span`
    font-size: 0.9rem;
    margin-top: 1rem;
  `,
}
