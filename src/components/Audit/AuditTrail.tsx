import React from 'react'
import { gql, useQuery } from 'gql'
import { hasError } from 'api'
import { Text, Spinner } from '..'
import Log from './Log'
import type * as T from 'gql/types'
import * as S from './styles'

const QUERY_TRAIL = gql`
  query QueryAuditTrail($trailId: ID!) {
    audit(trail: $trailId) {
      id
      date
      payload
      objects {
        ...AuditUser
        ...AuditSpace
      }
    }
  }

  fragment AuditUser on Person {
    id
    name
    handle
  }

  fragment AuditSpace on Space {
    id
    name
    handle
  }
`

interface Props {
  trailId: string
}

export default function Trail({ trailId }: Props) {
  const { data: { audit } = {}, error, loading } = useQuery<T.QueryAuditTrail>(
    QUERY_TRAIL,
    {
      variables: { trailId },
      errorPolicy: 'none',
      fetchPolicy: 'network-only',
    }
  )

  const forbidden = hasError(error, 'FORBIDDEN')

  if (loading) return <Spinner />
  if (forbidden)
    return <Text>You are not allowed to view this audit trail.</Text>

  return (
    <S.Trail>
      <S.List>
        {audit?.map(log => (
          <Log key={log.id} log={log} />
        ))}
      </S.List>
    </S.Trail>
  )
}
