import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Dropdown } from 'components'
import { useQuery, useMutation } from 'gql'
import type * as T from 'gql/types'
import { MEMBER_QUERY, MEMBER_INFO, REMOVE_MEMBER } from './gql'

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

  const [remove] = useMutation(REMOVE_MEMBER, {
    variables: { spaceId, userId },
    update(cache) {
      const data = cache.readQuery<T.SpaceMembers>({
        query: MEMBER_QUERY,
        variables: { spaceId },
      })
      if (!data?.space) return
      cache.writeQuery({
        query: MEMBER_QUERY,
        variables: { spaceId },
        data: {
          ...data,
          space: {
            ...data.space,
            members: data.space.members?.filter(({ id }) => id !== userId),
            mentors: data.space.mentors?.filter(({ id }) => id !== userId),
            owners: data.space.owners?.filter(({ id }) => id !== userId),
          },
        },
      })
    },
  })

  return (
    <S.Wrap>
      <Icon icon="more" onClick={() => setOpen(!open)} />
      {open && !loading && data?.space && (
        <Dropdown
          onClose={() => setTimeout(() => setOpen(false), 100)}
          onClick={key => ({ remove }[key]?.())}
        >
          <span key="mentor">
            {data.space.isMentor ? 'Remove from' : 'Add to'} mentor list
          </span>
          <span key="owner">
            {data.space.isOwner ? 'Revoke ' : 'Add '} owner permissions
          </span>
          <span key="remove">Remove from space</span>
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
