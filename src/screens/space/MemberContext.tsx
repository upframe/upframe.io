import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Dropdown } from 'components'
import { gql, useQuery } from 'gql'
import type * as T from 'gql/types'

const MEMBER_INFO = gql`
  query MemberInfo($spaceId: ID!, $userId: ID!) {
    space(id: $spaceId) {
      id
      isMentor(user: $userId)
      isOwner(user: $userId)
    }
  }
`

interface Props {
  spaceId: string
  userId: string
}

export default function MemberContext({ spaceId, userId }: Props) {
  const [open, setOpen] = useState(false)

  const { data, loading } = useQuery<T.MemberInfo, T.MemberInfoVariables>(
    MEMBER_INFO,
    {
      variables: { spaceId, userId },
      skip: !open,
    }
  )

  return (
    <S.Wrap>
      <Icon icon="more" onClick={() => setOpen(!open)} />
      {open && !loading && data?.space && (
        <Dropdown onClose={() => setTimeout(() => setOpen(false), 100)}>
          <span key="mentor">
            {data.space.isMentor ? 'Remove from' : 'Add to'} mentor list
          </span>
          <span key="owner">
            {data.space.isOwner ? 'Revoke ' : 'Add '} owner permissions
          </span>
        </Dropdown>
      )}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    margin-left: 1rem;
    position: relative;

    ol {
      left: unset;
      right: 0;

      font-size: 0.9rem;
    }
  `,
}
