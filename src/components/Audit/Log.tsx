import React from 'react'
import type { QueryAuditTrail_audit } from 'gql/types'
import { useComputed } from 'utils/hooks'
import * as S from './styles'
import msg from './msg'

const formatDate = (date: Date) =>
  `${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}, ${date.getFullYear()}  ${date.toLocaleTimeString('en-US')}`

interface Props {
  log: QueryAuditTrail_audit
}

export default function Log({ log }: Props) {
  const message = useComputed(log, msg, 'json')
  const time = useComputed(new Date(log.date), formatDate, 'json')

  return (
    <S.Log>
      {message}
      <S.Time>{time}</S.Time>
    </S.Log>
  )
}
