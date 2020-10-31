import React from 'react'
import styled from 'styled-components'
import type { QueryAuditTrail_audit } from 'gql/types'
import { useComputed } from 'utils/hooks'

interface Props {
  log: QueryAuditTrail_audit
}

export default function Log({ log }: Props) {
  const message = useComputed(log, buildMessage, 'json')
  const time = useComputed(log.date, v => new Date(v).toISOString())

  return (
    <S.Log>
      {message}
      <S.Time>{time}</S.Time>
    </S.Log>
  )
}

type AuditEvent = QueryAuditTrail_audit & { eventType: string }

function buildMessage(raw: QueryAuditTrail_audit) {
  const log: AuditEvent = { ...JSON.parse(raw.payload), ...raw }

  switch (log.eventType) {
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
    border-bottom: 1px dashed #0003;
  `,

  Message: styled.p`
    font-size: 1rem;
    margin: 0;
  `,

  Time: styled.span`
    font-size: 0.9rem;
    margin-top: 1rem;
  `,
}
