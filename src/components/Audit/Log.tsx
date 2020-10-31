import React from 'react'
import styled from 'styled-components'
import type { QueryAuditTrail_audit } from 'gql/types'

interface Props {
  log: QueryAuditTrail_audit
}

export default function Log({ log }: Props) {
  console.log(log)

  return <S.Log>{log.editor?.name}</S.Log>
}

const S = {
  Log: styled.li``,
}
